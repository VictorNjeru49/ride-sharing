import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRidefeedbackDto {
  @ApiProperty()
  @IsString()
  feedbackText: string;
}
