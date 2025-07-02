import { Injectable } from '@nestjs/common';
import { CreateWalletDto, UpdateWalletDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    const wallet = this.walletRepo.create(createWalletDto);
    return await this.walletRepo.save(wallet);
  }

  findAll() {
    return `This action returns all wallets`;
  }

  async findOne(id: string): Promise<Wallet | null> {
    return await this.walletRepo.findOne({ where: { id } });
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({ where: { id } });
    if (!wallet) {
      throw new Error(`Wallet with id ${id} not found`);
    }
    await this.walletRepo.update(wallet.id, updateWalletDto);
    const updatedWallet = await this.findOne(id);
    if (!updatedWallet) {
      throw new Error(`Wallet with id ${id} not found after update`);
    }
    return updatedWallet;
  }

  remove(id: string) {
    return `This action removes a #${id} wallet`;
  }
}
