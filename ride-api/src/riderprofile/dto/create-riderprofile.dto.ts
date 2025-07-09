import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRiderprofileDto {
  @ApiProperty()
  @IsString()
  preferredPaymentMethod: string;

  @ApiProperty()
  @IsNumber()
  rating: number;
}
