import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Riderequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  riderId: string;

  @Column({ nullable: true })
  assignedDriverId: string;

  @Column({ nullable: true })
  pickupLocationId: string;

  @Column({ nullable: true })
  dropoffLocationId: string;

  @ManyToOne(() => Riderprofile, (rp) => rp.rideRequests, {
    nullable: false,
    onDelete: 'CASCADE',
    // eager: true,
  })
  @JoinColumn({ name: 'riderId' })
  rider: Riderprofile;

  @ManyToOne(() => Driverprofile, (dp) => dp.assignedRequests, {
    nullable: true,
    // eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignedDriverId' })
  assignedDriver: Driverprofile;

  @ManyToOne(() => Location, (l) => l.requestsPickup, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'pickupLocationId' })
  pickupLocation: Location;

  @ManyToOne(() => Location, (l) => l.requestsDropoff, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dropoffLocationId' })
  dropoffLocation: Location;

  @Column()
  status: string;

  @Column({ nullable: true })
  preferredVehicleType: string;

  @Column('timestamp', { nullable: true })
  requestedAt: Date;
}
