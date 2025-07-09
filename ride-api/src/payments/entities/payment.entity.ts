import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Define enum for payment methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

// Define enum for payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ride, (r) => r.payments)
  @JoinColumn()
  ride: Ride;

  @ManyToOne(() => User, (u) => u.payments)
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  stripePaymentIntentId?: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column('timestamp', { nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
