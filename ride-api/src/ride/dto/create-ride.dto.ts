import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateRideDto {
  @ApiProperty()
  @IsString()
  status: string;
  @ApiProperty()
  @IsNumber()
  fare: number;
  @ApiProperty()
  @IsNumber()
  distanceKm: number;
  @ApiProperty()
  @IsDate()
  startTime: Date;
  @ApiProperty()
  @IsDate()
  endTime: Date;
}
