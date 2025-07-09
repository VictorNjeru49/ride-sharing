import { ApiProperty } from '@nestjs/swagger';
import { NotifyStatus } from '../entities/notification.entity';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsEnum(NotifyStatus)
  type: NotifyStatus.SYSTEM;
  @ApiProperty()
  @IsString()
  message: string;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isRead: boolean;
}
