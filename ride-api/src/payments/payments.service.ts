import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { In, Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Ride } from 'src/ride/entities/ride.entity';

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
    @InjectRepository(Ride)
    private readonly rideRepo: Repository<Ride>,
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
      },
    });

    console.log(paymentIntent);
    const payment = this.paymentRepo.create({
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
      user: { id: createPaymentDto.userId },
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
    } else if (paymentIntent.status === 'requires_payment_method') {
      payment.status = PaymentStatus.FAILED;
    }

    await this.paymentRepo.save(payment);

    return {
      payment,
      stripePaymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayments(paymentIntentId: string): Promise<{
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

  private async getSessionWithPaymentIntent(
    sessionId: string,
    maxRetries = 10,
    delayMs = 1500,
  ): Promise<Stripe.Checkout.Session> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });

      if (
        session.payment_intent &&
        typeof session.payment_intent !== 'string'
      ) {
        return session;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    throw new Error('payment_intent not available after retries');
  }

  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    if (!paymentIntentId) {
      throw new BadRequestException('paymentIntentId is required');
    }

    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const userId = paymentIntent.metadata.user;
    if (!userId) {
      throw new BadRequestException('Missing metadata in payment intent');
    }

    const amount = paymentIntent.amount_received / 100;

    if (paymentIntent.status === 'succeeded') {
      // Delete createCheckoutSession and getSession payments for this user
      // await this.deletePayments(userId, [
      //   PaymentStatus.PENDING,
      //   PaymentStatus.SESSION_RETRIEVED,
      // ]);

      // Save only confirmPayment record with COMPLETED status
      const payment = this.paymentRepo.create({
        amount,
        method: PaymentMethod.STRIPE_CHECKOUT,
        status: PaymentStatus.COMPLETED,
        user: { id: userId },
        currency: paymentIntent.currency,
        stripePaymentIntentId: paymentIntent.id,
      });

      return await this.paymentRepo.save(payment);
    } else if (
      ['requires_payment_method', 'canceled', 'failed'].includes(
        paymentIntent.status,
      )
    ) {
      await this.deletePayments(userId, [
        PaymentStatus.SESSION_RETRIEVED,
        PaymentStatus.COMPLETED,
      ]);

      const payment = this.paymentRepo.create({
        amount,
        method: PaymentMethod.STRIPE_CHECKOUT,
        status: PaymentStatus.PENDING,
        user: { id: userId },
        currency: paymentIntent.currency,
        stripePaymentIntentId: paymentIntent.id,
      });

      return await this.paymentRepo.save(payment);
    } else {
      throw new BadRequestException(
        `Payment not completed, current status: ${paymentIntent.status}`,
      );
    }
  }

  async getSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (!session.payment_intent) {
      throw new BadRequestException('payment_intent missing in session');
    }

    // Check and handle possibly null amount_total
    if (session.amount_total === null) {
      throw new BadRequestException('Session amount_total is null');
    }
    const amount = session.amount_total / 100;

    // Check metadata existence and user id inside metadata
    if (!session.metadata || !session.metadata.user) {
      throw new BadRequestException('Session metadata or user ID missing');
    }
    const userId = session.metadata.user;

    // Check currency is non-null
    if (!session.currency) {
      throw new BadRequestException('Session currency is missing');
    }
    const currency = session.currency;

    // Check if payment record already exists for this session
    const existingPayment = await this.paymentRepo.findOne({
      where: { stripeCheckoutSessionId: session.id },
    });

    if (!existingPayment) {
      const payment = this.paymentRepo.create({
        amount,
        method: PaymentMethod.STRIPE_CHECKOUT,
        status: PaymentStatus.SESSION_RETRIEVED,
        user: { id: userId },
        currency,
        stripeCheckoutSessionId: session.id,
      });
      await this.paymentRepo.save(payment);
    }

    return session;
  }

  async createCheckoutSession(
    createPaymentDto: CreatePaymentDto,
  ): Promise<CreateCheckoutSessionResponse> {
    const amountInCents = Number.isInteger(createPaymentDto.amount)
      ? createPaymentDto.amount * 100
      : Math.round(createPaymentDto.amount * 100);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: createPaymentDto.currency,
            unit_amount: amountInCents,
            product_data: {
              name: 'Vehicle Rental Payment',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        user: createPaymentDto.userId,
      },
      payment_intent_data: {
        metadata: {
          user: createPaymentDto.userId,
        },
        capture_method: 'automatic',
        description: 'Vehicle rental payment',
      },
      success_url: `${this.configService.get('FRONTEND_URL')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/payment-cancel`,
      expand: ['payment_intent'], // make sure paymentIntent is expanded
    });

    if (!session.url) {
      throw new Error('Stripe Checkout session URL is null');
    }

    // Save createCheckoutSession payment record
    const payment = this.paymentRepo.create({
      amount: createPaymentDto.amount,
      method: PaymentMethod.STRIPE_CHECKOUT,
      status: PaymentStatus.PENDING,
      user: { id: createPaymentDto.userId },
      currency: createPaymentDto.currency,
      stripeCheckoutSessionId: session.id,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    return {
      url: session.url,
      clientSecret: session.client_secret!,
      payment: savedPayment,
    };
  }

  private async deletePayments(userId: string, statuses: PaymentStatus[]) {
    await this.paymentRepo.delete({
      user: { id: userId },
      status: In(statuses),
    });
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepo.find({
      relations: { user: true, ride: true },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: { user: true, ride: true },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
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
    const payment = await this.findOne(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    await this.paymentRepo.remove(payment);
  }
}
