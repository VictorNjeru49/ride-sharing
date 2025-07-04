import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @ValidateIf((o: CreateAuthDto) => !o.phone)
  @IsEmail({}, { message: 'Email must be valid' })
  @IsOptional()
  email?: string;

  @ApiProperty()
  @ValidateIf((o: CreateAuthDto) => !o.email)
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  password: string;
}
