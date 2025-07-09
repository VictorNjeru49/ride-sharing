import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { superRole } from '../entities/admin.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(superRole)
  role?: superRole.MODERATOR;

  @ApiProperty()
  @IsString()
  @IsArray()
  permission: string[];
}
