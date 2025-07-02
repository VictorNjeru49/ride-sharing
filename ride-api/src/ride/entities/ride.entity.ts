import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Ridecancel } from 'src/ridecancel/entities/ridecancel.entity';
import { Ridefeedback } from 'src/ridefeedback/entities/ridefeedback.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Riderprofile, (rp) => rp.ridesTaken) rider: Riderprofile;
  @ManyToOne(() => Driverprofile, (dp) => dp.ridesOffered)
  driver: Driverprofile;
  @ManyToOne(() => Location, (l) => l.ridesPickup) pickupLocation: Location;
  @ManyToOne(() => Location, (l) => l.ridesDropoff) dropoffLocation: Location;
  @Column()
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  fare: number;

  @Column('decimal', { precision: 7, scale: 2 })
  distanceKm: number;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp', { nullable: true })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Payment, (p) => p.ride, { cascade: true }) payment: Payment;
  @OneToMany(() => Rating, (r) => r.ride) ratings: Rating[];
  @OneToOne(() => Ridecancel, (c) => c.ride, { cascade: true })
  cancellation: Ridecancel;
  @OneToMany(() => Ridefeedback, (f) => f.ride) feedbacks: Ridefeedback[];
}
