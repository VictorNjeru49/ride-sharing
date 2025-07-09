import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto, UpdateWalletDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet, WalletTransactionType } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(User) private readonly userRepo: Repository<User>, // Inject User repo
  ) {}

  async create(createWalletDto: CreateWalletDto & { userId: string }) {
    // Find user first
    const user = await this.userRepo.findOne({
      where: { id: createWalletDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${createWalletDto.userId} not found`,
      );
    }

    // Create wallet transaction entity
    const walletTransaction = this.walletRepo.create({
      user,
      type: createWalletDto.type || WalletTransactionType.CREDIT,
      amount: createWalletDto.amount,
      description: createWalletDto.description,
    });

    // Start a transaction to save wallet transaction and update user balance atomically
    return await this.walletRepo.manager.transaction(async (manager) => {
      // Save wallet transaction
      const savedTransaction = await manager.save(walletTransaction);

      // Update user's wallet balance
      if (walletTransaction.type === WalletTransactionType.CREDIT) {
        user.walletBalance =
          Number(user.walletBalance) + Number(walletTransaction.amount);
      } else if (walletTransaction.type === WalletTransactionType.DEBIT) {
        user.walletBalance =
          Number(user.walletBalance) - Number(walletTransaction.amount);
      }

      await manager.save(user);

      return savedTransaction;
    });
  }

  // Other methods remain unchanged...

  async findAll() {
    return await this.walletRepo.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Wallet | null> {
    return await this.walletRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({ where: { id } });
    if (!wallet) {
      throw new NotFoundException(`Wallet with id ${id} not found`);
    }
    await this.walletRepo.update(wallet.id, updateWalletDto);
    const updatedWallet = await this.findOne(id);
    if (!updatedWallet) {
      throw new NotFoundException(
        `Wallet with id ${id} not found after update`,
      );
    }
    return updatedWallet;
  }

  async remove(id: string) {
    return await this.walletRepo.delete(id);
  }
}
