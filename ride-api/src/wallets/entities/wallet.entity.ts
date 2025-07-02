import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum WalletTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.walletTransactions) user: User;
  @Column({ default: WalletTransactionType.CREDIT })
  type: WalletTransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
