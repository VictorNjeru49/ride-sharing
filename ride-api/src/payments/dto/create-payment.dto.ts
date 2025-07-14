import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsOptional } from 'class-validator';
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
  @IsDate()
  @IsOptional()
  paidAt: Date;
  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  rideId: string;
}
