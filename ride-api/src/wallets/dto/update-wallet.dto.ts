import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @ApiProperty()
  @IsString()
  id: string;
}
