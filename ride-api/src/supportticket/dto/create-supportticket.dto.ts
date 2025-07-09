import { ApiProperty } from '@nestjs/swagger';
import { SupportStatus } from '../entities/supportticket.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateSupportticketDto {
  @ApiProperty()
  @IsString()
  issueType: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  @IsEnum(SupportStatus)
  status: SupportStatus.OPEN;
}
