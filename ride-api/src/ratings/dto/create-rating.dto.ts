import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  score: number;
  @ApiProperty()
  @IsString()
  comment: string;
}
