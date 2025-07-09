import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsNumber()
  latitude: number;
  @ApiProperty()
  @IsNumber()
  longitude: number;
}
