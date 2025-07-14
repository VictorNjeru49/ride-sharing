import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  vehicleImage: string;
  @ApiProperty()
  @IsString()
  make: string;
  @ApiProperty()
  @IsString()
  model: string;
  @ApiProperty()
  @IsString()
  plateNumber: string;
  @ApiProperty()
  @IsNumber()
  rentalrate: number;

  @ApiProperty()
  @IsString()
  color: string;
  @ApiProperty()
  @IsNumber()
  capacity: number;
  @ApiProperty()
  @IsNumber()
  year: number;
  @ApiProperty()
  @IsString()
  vehicleType: string;
}
