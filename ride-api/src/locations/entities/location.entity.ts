import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  address: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @OneToMany(() => Ride, (r) => r.pickupLocation) ridesPickup: Ride[];
  @OneToMany(() => Ride, (r) => r.dropoffLocation) ridesDropoff: Ride[];
  @OneToMany(() => Riderequest, (rr) => rr.pickupLocation)
  requestsPickup: Riderequest[];
  @OneToMany(() => Riderequest, (rr) => rr.dropoffLocation)
  requestsDropoff: Riderequest[];
}
