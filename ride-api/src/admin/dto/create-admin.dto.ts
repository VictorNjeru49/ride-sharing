import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { superRole } from '../entities/admin.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class CreateAdminDto {
  @ApiProperty()
  @Optional()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(superRole)
  role?: superRole.ADMIN;

  @ApiProperty()
  @IsString()
  @IsArray()
  permission: string[];
}
