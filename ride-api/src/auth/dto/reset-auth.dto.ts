import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The reset token received via email.',
    example: 'your_reset_token_here',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The new password to set for the user account.',
    example: 'new_secure_password',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
