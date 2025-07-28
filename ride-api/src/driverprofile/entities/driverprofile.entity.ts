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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.driverProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 50, nullable: true })
  licenseNumber: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: false })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.driver, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  vehicle: Vehicle;

  @OneToMany(() => Ride, (ride) => ride.driver, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  ridesOffered: Ride[];

  @OneToMany(() => Ride, (ride) => ride.rider, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  ridesTaken: Ride[];

  @OneToMany(() => Riderequest, (rr) => rr.assignedDriver, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  assignedRequests: Riderequest[];

  @OneToMany(() => Driverlocation, (dl) => dl.driverProfile, {
    cascade: true,
  })
  locationHistory: Driverlocation[];
}
