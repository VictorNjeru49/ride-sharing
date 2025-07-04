import { Admin } from 'src/admin/entities/admin.entity';
import { Device } from 'src/device/entities/device.entity';
import { Driverlocation } from 'src/driverlocation/entities/driverlocation.entity';
import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Promocode } from 'src/promocode/entities/promocode.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Ridefeedback } from 'src/ridefeedback/entities/ridefeedback.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { Supportticket } from 'src/supportticket/entities/supportticket.entity';
import { Userpromousage } from 'src/userpromousage/entities/userpromousage.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

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

  @Column({ type: 'bigint', nullable: true })
  phone: bigint;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RIDER })
  role: UserRole;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ default: false })
  isVerified: boolean;

  // 🔒 Social Login Fields
  @Column({ nullable: true })
  provider: string; // e.g., "google", "facebook"

  @Column({ nullable: true })
  providerId: string; // e.g., Google/Facebook unique ID

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Riderprofile, (rp) => rp.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  riderProfile: Riderprofile;

  @OneToOne(() => Driverprofile, (dp) => dp.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  driverProfile: Driverprofile;

  @OneToMany(() => Riderequest, (rr) => rr.rider, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rideRequests: Riderequest[];

  @OneToMany(() => Ride, (ride) => ride.driver, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ridesOffered: Ride[];

  @OneToMany(() => Ride, (ride) => ride.rider, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ridesTaken: Ride[];

  @OneToMany(() => Payment, (p) => p.user, {
    cascade: true,
    onDelete: 'CASCADE',
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
    cascade: true,
    onDelete: 'CASCADE',
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

  @OneToOne(() => Admin, (a) => a.user, { cascade: true, onDelete: 'CASCADE' })
  adminProfile: Admin;

  @OneToMany(() => Promocode, (pc) => pc.code, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  createdPromoCodes: Promocode[];

  @OneToMany(() => Driverlocation, (driverLocation) => driverLocation.driver, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  driverLocations: Driverlocation[];
}
