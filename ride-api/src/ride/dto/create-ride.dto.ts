import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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
  @IsString()
  startTime: Date;
  @ApiProperty()
  @IsString()
  endTime: Date;
}
