import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Admin } from 'src/admin/entities/admin.entity';
import { Device } from 'src/device/entities/device.entity';
import { Driverlocation } from 'src/driverlocation/entities/driverlocation.entity';
import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Promocode } from 'src/promocode/entities/promocode.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Ridefeedback } from 'src/ridefeedback/entities/ridefeedback.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { Supportticket } from 'src/supportticket/entities/supportticket.entity';
import { Userpromousage } from 'src/userpromousage/entities/userpromousage.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';

export enum UserRole {
  RIDER = 'rider',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  firstName: string;

  @Column({ length: 100, nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RIDER })
  role: UserRole;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // One-to-One Relations
  @OneToOne(() => Riderprofile, (rp) => rp.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  riderProfile: Riderprofile;

  @OneToOne(() => Driverprofile, (dp) => dp.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  driverProfile: Driverprofile;

  @OneToOne(() => Admin, (admin) => admin.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  adminProfile: Admin;

  // // One-to-Many Relations
  // @OneToMany(() => Ride, (ride) => ride.driver, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // ridesOffered: Ride[];

  // @OneToMany(() => Ride, (ride) => ride.rider, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // ridesTaken: Ride[];

  @OneToMany(() => Payment, (p) => p.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  payments: Payment[];

  @OneToMany(() => Rating, (r) => r.rater, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (r) => r.ratee, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratingsReceived: Rating[];

  @OneToMany(() => Wallet, (wt) => wt.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  walletTransactions: Wallet[];

  @OneToMany(() => Ridefeedback, (f) => f.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rideFeedbacks: Ridefeedback[];

  @OneToMany(() => Supportticket, (t) => t.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  supportTickets: Supportticket[];

  @OneToMany(() => Notification, (n) => n.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  notifications: Notification[];

  @OneToMany(() => Device, (d) => d.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  devices: Device[];

  @OneToMany(() => Userpromousage, (u) => u.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  promoUsages: Userpromousage[];

  @OneToMany(() => Promocode, (promo) => promo.createdBy)
  createdPromoCodes: Promocode[];

  @OneToMany(() => Driverlocation, (driverLocation) => driverLocation.driver, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  driverLocations: Driverlocation[];
}
