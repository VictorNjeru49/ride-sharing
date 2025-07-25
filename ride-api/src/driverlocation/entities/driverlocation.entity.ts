import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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
  @ManyToOne(() => Driverprofile, (profile) => profile.locationHistory, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'driverProfileId' })
  driverProfile: Driverprofile;

  @ManyToOne(() => Riderprofile, (profile) => profile.riderHistory, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'RiderProfileeId' })
  riderProfile: Riderprofile;
  // New relation to Location entity representing the driver's current or requested location
  @OneToOne(() => Location, (location) => location.driverlocation, {
    onDelete: 'CASCADE',
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;
}
