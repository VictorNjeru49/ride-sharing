import { ApiProperty } from '@nestjs/swagger';
import { RideCancelBy } from '../entities/ridecancel.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateRidecancelDto {
  @ApiProperty()
  @IsString()
  @IsEnum(RideCancelBy)
  cancelledBy: RideCancelBy.DRIVER;
  @ApiProperty()
  @IsString()
  reason: string;
}
