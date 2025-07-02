import { Driverlocation } from 'src/driverlocation/entities/driverlocation.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Driverprofile {
  @PrimaryGeneratedColumn('uuid') id: string;
  @OneToOne(() => User, (u) => u.driverProfile) @JoinColumn() user: User;
  @Column() licenseNumber: string;
  @Column('decimal', { precision: 2, scale: 1, default: 0 }) rating: number;
  @Column({ default: false }) isAvailable: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @OneToOne(() => Vehicle, (v) => v.driver, { cascade: true })
  @JoinColumn()
  vehicle: Vehicle;
  @OneToMany(() => Ride, (r) => r.driver) ridesOffered: Ride[];
  @OneToMany(() => Riderequest, (rr) => rr.assignedDriver)
  assignedRequests: Riderequest[];
  @OneToMany(() => Driverlocation, (dl) => dl.driver)
  locationHistory: Driverlocation[];
}
