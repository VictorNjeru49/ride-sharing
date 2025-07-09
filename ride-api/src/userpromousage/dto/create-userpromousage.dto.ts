import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class CreateUserpromousageDto {
  @ApiProperty()
  @IsDate()
  usedAt: Date;
}
