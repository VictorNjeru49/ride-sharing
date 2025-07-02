import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { WalletTransactionType } from '../entities/wallet.entity';

export class CreateWalletDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum({ WalletTransactionType })
  type?: WalletTransactionType.CREDIT;
}
