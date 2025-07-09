import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreatePromocodeDto {
  @ApiProperty()
  @IsString()
  code: string;
  @ApiProperty()
  @IsNumber()
  discountAmount: number;
  @ApiProperty()
  @IsNumber()
  usageLimit: number;
  @ApiProperty()
  @IsDate()
  expirationDate: Date;
}
