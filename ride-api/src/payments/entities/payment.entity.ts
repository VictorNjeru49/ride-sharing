import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

// Define enum for payment methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  STRIPE_CHECKOUT = 'stripe_checkout',
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

  @OneToOne(() => Ride, (r) => r.payment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  ride: Ride;

  @ManyToOne(() => User, (u) => u.payments, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  method: PaymentMethod;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.payments, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  vehicle: Vehicle;

  @Column({ nullable: true })
  stripeCheckoutSessionId: string;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

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
