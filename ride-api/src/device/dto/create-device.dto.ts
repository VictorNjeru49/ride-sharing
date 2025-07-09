import { IsEnum, IsOptional, IsString } from 'class-validator';
import { devicestatus } from '../entities/device.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  deviceToken: string;

  @ApiProperty()
  @IsString()
  @IsEnum(devicestatus)
  @IsOptional()
  deviceType: devicestatus.ANDROID;
}
