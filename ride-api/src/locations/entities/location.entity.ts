import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(() => Ride, (r) => r.pickupLocation, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  ridesPickup: Ride[];
  @OneToMany(() => Ride, (r) => r.dropoffLocation, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  ridesDropoff: Ride[];
  @OneToMany(() => Riderequest, (rr) => rr.pickupLocation, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  requestsPickup: Riderequest[];
  @OneToMany(() => Riderequest, (rr) => rr.dropoffLocation, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  requestsDropoff: Riderequest[];
}
