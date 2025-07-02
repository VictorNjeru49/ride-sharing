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

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RIDER })
  role: UserRole;

  @Column()
  hashedRefreshToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Riderprofile, (rp) => rp.user, { cascade: true })
  riderProfile: Riderprofile;

  @OneToOne(() => Driverprofile, (dp) => dp.user, { cascade: true })
  driverProfile: Driverprofile;

  @OneToMany(() => Riderequest, (rr) => rr.rider)
  rideRequests: Riderequest[];

  @OneToMany(() => Ride, (ride) => ride.driver)
  ridesOffered: Ride[];

  @OneToMany(() => Ride, (ride) => ride.rider) ridesTaken: Ride[];

  @OneToMany(() => Payment, (p) => p.user) payments: Payment[];

  @OneToMany(() => Rating, (r) => r.rater) ratingsGiven: Rating[];

  @OneToMany(() => Rating, (r) => r.ratee) ratingsReceived: Rating[];

  @OneToMany(() => Wallet, (wt) => wt.user)
  walletTransactions: Wallet[];

  @OneToMany(() => Ridefeedback, (f) => f.user) rideFeedbacks: Ridefeedback[];

  @OneToMany(() => Supportticket, (t) => t.user)
  supportTickets: Supportticket[];

  @OneToMany(() => Notification, (n) => n.user) notifications: Notification[];

  @OneToMany(() => Device, (d) => d.user) devices: Device[];

  @OneToMany(() => Userpromousage, (u) => u.user) promoUsages: Userpromousage[];

  @OneToOne(() => Admin, (a) => a.user, { cascade: true }) adminProfile: Admin;

  @OneToMany(() => Promocode, (pc) => pc.code)
  createdPromoCodes: Promocode[];
  @OneToMany(() => Driverlocation, (driverLocation) => driverLocation.driver)
  driverLocations: Driverlocation[];
}
