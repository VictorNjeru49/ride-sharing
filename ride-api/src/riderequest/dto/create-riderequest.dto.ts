import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateRiderequestDto {
  @ApiProperty()
  @IsString()
  status: string;
  @ApiProperty()
  @IsString()
  preferredVehicleType: string;
  @ApiProperty()
  @IsDate()
  requestedAt: Date;
}
