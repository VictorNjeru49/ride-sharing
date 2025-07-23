import { Driverlocation } from 'src/driverlocation/entities/driverlocation.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Riderprofile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: true })
  preferredPaymentMethod: string;

  @Column({ type: 'float', default: 5.0, nullable: true })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.riderProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Riderequest, (rr) => rr.rider, {
    onDelete: 'CASCADE',
  })
  rideRequests: Riderequest[];

  @OneToMany(() => Ride, (r) => r.rider, { eager: true, onDelete: 'CASCADE' })
  ridesTaken: Ride[];

  @OneToMany(() => Driverlocation, (dl) => dl.riderProfile, {
    cascade: true,
  })
  riderHistory: Driverlocation[];
}
