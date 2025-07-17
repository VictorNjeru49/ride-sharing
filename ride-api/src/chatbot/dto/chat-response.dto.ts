import { IsString } from 'class-validator';

export class ChatResponseDto {
  @IsString()
  reply!: string;
}
