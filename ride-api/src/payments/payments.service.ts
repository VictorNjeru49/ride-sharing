import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Payment,
  PaymentMethod,
  // PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

type CreatePaymentResponse = {
  clientSecret: string;
  url?: string;
  payment: Partial<Payment>;
};

interface CreateCheckoutSessionResponse {
  url: string;
  clientSecret: string;
  payment: Partial<Payment>;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not set in environment variables');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async create(
    createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponse> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(createPaymentDto.amount * 100),
      currency: createPaymentDto.currency,
      payment_method_types: ['card'],
      metadata: {
        user: createPaymentDto.userId,
        vehicle: createPaymentDto.vehicleId,
      },
    });

    console.log(paymentIntent);
    const payment = this.paymentRepo.create({
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
      user: { id: createPaymentDto.userId },
      vehicle: { id: createPaymentDto.vehicleId },
      stripePaymentIntentId: paymentIntent.id,
    });

    await this.paymentRepo.save(payment);

    return {
      clientSecret: paymentIntent.client_secret!,
      payment,
    };
  }

  async confirmPaymentation(paymentIntentId: string): Promise<{
    payment: Payment;
    stripePaymentIntentId: string;
  }> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const payment = await this.paymentRepo.findOneOrFail({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (paymentIntent.status === 'succeeded') {
      payment.status = PaymentStatus.COMPLETED;
      payment.paidAt = new Date();
    } else if (paymentIntent.status === 'requires_payment_method') {
      payment.status = PaymentStatus.FAILED;
    }

    await this.paymentRepo.save(payment);

    return {
      payment,
      stripePaymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<{
    payment: Payment;
    stripePaymentIntentId: string;
  }> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const payment = await this.paymentRepo.findOneOrFail({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    // Update payment status based on PaymentIntent status
    switch (paymentIntent.status) {
      case 'succeeded':
        payment.status = PaymentStatus.COMPLETED;
        payment.paidAt = payment.paidAt || new Date();
        break;

      case 'requires_payment_method':
      case 'canceled':
        payment.status = PaymentStatus.FAILED;
        break;

      case 'processing':
      case 'requires_confirmation':
        payment.status = PaymentStatus.PENDING;
        break;

      default:
        throw new Error(
          `Unhandled payment intent status: ${paymentIntent.status}`,
        );
    }

    // Save the updated payment record
    await this.paymentRepo.save(payment);

    return {
      payment,
      stripePaymentIntentId: paymentIntent.id,
    };
  }

  async createCheckoutSession(
    createPaymentDto: CreatePaymentDto,
  ): Promise<CreateCheckoutSessionResponse> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: createPaymentDto.currency,
            product_data: {
              name: `Vehicle Rental - ${createPaymentDto.vehicleId}`,
            },
            unit_amount: Math.round(createPaymentDto.amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        user: createPaymentDto.userId,
        vehicle: createPaymentDto.vehicleId,
      },
      payment_intent_data: {
        metadata: {
          user: createPaymentDto.userId,
          vehicle: createPaymentDto.vehicleId,
        },
      },
      success_url: `${this.configService.get('FRONTEND_URL')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/payment-cancel`,
      expand: ['payment_intent'],
    });
    console.log(session);

    console.log(session.payment_intent);
    // Destructure payment_intent from session
    const { payment_intent: paymentIntent } = session;

    if (!paymentIntent || typeof paymentIntent === 'string') {
      throw new Error('payment_intent is null or not expanded');
    }
    if (!paymentIntent.client_secret) {
      throw new Error('PaymentIntent client_secret is null');
    }

    const payment = this.paymentRepo.create({
      amount: createPaymentDto.amount,
      method: PaymentMethod.STRIPE_CHECKOUT,
      status: PaymentStatus.PENDING,
      user: { id: createPaymentDto.userId },
      vehicle: { id: createPaymentDto.vehicleId },
      currency: createPaymentDto.currency,
      stripePaymentIntentId: paymentIntent.id,
      paidAt: new Date(),
    });

    await this.paymentRepo.save(payment);

    if (!session.url) {
      throw new Error('Stripe Checkout session URL is null');
    }

    if (!paymentIntent.client_secret) {
      throw new Error('PaymentIntent client_secret is null');
    }

    return {
      url: session.url,
      clientSecret: paymentIntent.client_secret,
      payment,
    };
  }

  // async create(createPaymentDto: CreatePaymentDto) {
  //   const payment = this.paymentRepo.create(createPaymentDto);
  //   return await this.paymentRepo.save(payment);
  // }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepo.find({
      relations: ['user', 'ride', 'vehicle'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['user', 'ride', 'vehicle'],
    });
    if (!payment) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    await this.paymentRepo.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const Payment = await this.findOne(id);
    console.log(`the Payment with id: ${id}`);
    await this.paymentRepo.delete(Payment);
  }
}
