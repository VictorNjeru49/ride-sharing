import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RideCancelBy {
  RIDER = 'rider',
  DRIVER = 'driver',
  SYSTEM = 'system',
}
@Entity()
export class Ridecancel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RideCancelBy })
  cancelledBy: RideCancelBy;

  @Column({ type: 'text' })
  reason: string;

  @CreateDateColumn()
  cancelledAt: Date;

  @ManyToOne(() => Ride, (ride) => ride.cancellation, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'rideId' })
  ride: Ride;

  @ManyToOne(() => User, (user) => user.cancel, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
