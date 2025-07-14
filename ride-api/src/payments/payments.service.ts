import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Payment,
  // PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

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
  ): Promise<{ clientSecret; payment: Payment }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(createPaymentDto.amount * 100),
      currency: createPaymentDto.currency,
      payment_method_types: ['card'],
      metadata: {
        userId: createPaymentDto.userId,
        rideId: createPaymentDto.rideId,
      },
    });

    const payment = this.paymentRepo.create({
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
      user: { id: createPaymentDto.userId },
      ride: { id: createPaymentDto.rideId },
      stripePaymentIntentId: paymentIntent.id,
      // paidAt: null,
    });
    await this.paymentRepo.save(payment);

    return { clientSecret: paymentIntent.client_secret, payment };
  }

  async comfirmPayment(paymentIntentId: string): Promise<Payment> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const payment = await this.paymentRepo.findOneOrFail({
      where: { id: paymentIntent.metadata.paymentIntentId },
    });

    if (paymentIntent.status === 'succeeded') {
      payment.status = PaymentStatus.COMPLETED;
      payment.paidAt = new Date();
    } else if (paymentIntent.status === 'requires_payment_method') {
      payment.status = PaymentStatus.FAILED;
    }
    await this.paymentRepo.save(payment);
    return payment;
  }

  // async create(createPaymentDto: CreatePaymentDto) {
  //   const payment = this.paymentRepo.create(createPaymentDto);
  //   return await this.paymentRepo.save(payment);
  // }

  async findAll() {
    return await this.paymentRepo.find({
      relations: ['user', 'ride'],
    });
  }

  async findOne(id: string) {
    return await this.paymentRepo.findOne({
      where: { id },
      relations: ['user', 'ride'],
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepo.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.paymentRepo.delete(id);
  }
}
