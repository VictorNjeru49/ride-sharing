import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone Number', example: '+2547123456789' })
  @IsPhoneNumber()
  @MinLength(15)
  phone: string;

  @ApiProperty({ description: 'User password', example: 'securePassword123' })
  @IsString()
  @MinLength(15)
  password: string;

  @ApiProperty({ description: 'User role', example: 'RIDER' })
  @IsString()
  @IsEnum(UserRole)
  userType: UserRole;
}
