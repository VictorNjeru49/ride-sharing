import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsString()
  method: PaymentMethod.CREDIT_CARD;
  @ApiProperty()
  @IsString()
  currency: string;
  @ApiProperty()
  @IsString()
  status: PaymentStatus;
  @ApiProperty()
  @IsDate()
  paidAt: Date;
  @ApiProperty()
  @IsString()
  userId: string;
  @ApiProperty()
  @IsString()
  rideId: string;
}
