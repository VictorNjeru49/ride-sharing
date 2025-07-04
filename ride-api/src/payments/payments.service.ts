import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepo.create(createPaymentDto);
    return await this.paymentRepo.save(payment);
  }

  async findAll() {
    return await this.paymentRepo.find();
  }

  async findOne(id: string) {
    return await this.paymentRepo.findOne({ where: { id } });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepo.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.paymentRepo.delete(id);
  }
}
