import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Riderequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Riderprofile, (rp) => rp.rideRequests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  rider: Riderprofile;

  @ManyToOne(() => Driverprofile, (dp) => dp.assignedRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  assignedDriver: Driverprofile;

  @ManyToOne(() => Location, (l) => l.requestsPickup, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  pickupLocation: Location;

  @ManyToOne(() => Location, (l) => l.requestsDropoff, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  dropoffLocation: Location;

  @Column()
  status: string;

  @Column({ nullable: true })
  preferredVehicleType: string;

  @Column('timestamp')
  requestedAt: Date;
}
