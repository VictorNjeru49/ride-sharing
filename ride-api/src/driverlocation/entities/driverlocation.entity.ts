import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DriverLocationStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
}
@Entity()
export class Driverlocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DriverLocationStatus,
    default: DriverLocationStatus.PENDING,
  })
  status: DriverLocationStatus;

  @Column()
  preferredVehicleType: string;

  @CreateDateColumn()
  requestedAt: Date;

  @ManyToOne(() => User, (user) => user.driverLocations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'driverId' })
  driver: User;
}
