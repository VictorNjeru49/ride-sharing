import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDriverprofileDto {
  @ApiProperty()
  @IsString()
  licenseNumber: string;
  @ApiProperty()
  @IsNumber()
  rating: number;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}
