import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount: number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  method: PaymentMethod.CREDIT_CARD;
  @ApiProperty()
  @IsString()
  @IsOptional()
  currency: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  status: PaymentStatus;
  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  paymentIntentId: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  clientSecret: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  url: string;
}
