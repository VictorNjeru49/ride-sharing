import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DriverLocationStatus } from '../entities/driverlocation.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverlocationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(DriverLocationStatus)
  status: DriverLocationStatus.PENDING;

  @ApiProperty()
  @IsString()
  @IsOptional()
  preferredVehicleType: string;
}
