import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Payment } from './entities/payment.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
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
  private stripe: Stripe;
  @Public()
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<{ clientSecret: string; payment: Partial<Payment> }> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Public()
  @Post('checkout')
  async createCheckoutSession(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<{ url: string }> {
    return this.paymentsService.createCheckoutSession(createPaymentDto);
  }

  @Public()
  @Post('confirm')
  async confirmPayment(@Body() { paymentIntentId }: CreatePaymentDto) {
    if (!paymentIntentId) {
      throw new BadRequestException('paymentIntentId is required');
    }
    return await this.paymentsService.confirmPayment(paymentIntentId);
  }

  @Public()
  @Get('session/:sessionId')
  async getSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (!session.payment_intent) {
      throw new BadRequestException('payment_intent is missing from session');
    }
    return { paymentIntentId: session.payment_intent };
  }

  @Public()
  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
