import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRiderequestDto {
  @ApiProperty()
  @IsString()
  status: string;
  @ApiProperty()
  @IsString()
  preferredVehicleType: string;
  @ApiProperty()
  @IsString()
  requestedAt: Date;
}
