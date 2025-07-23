import { PartialType } from '@nestjs/swagger';
import { CreateRiderequestDto } from './create-riderequest.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRiderequestDto extends PartialType(CreateRiderequestDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  assignedDriverId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  riderId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  pickupLocationId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  dropoffLocationId?: string;
}
