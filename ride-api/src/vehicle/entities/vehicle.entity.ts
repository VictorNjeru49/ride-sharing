import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => Driverprofile, (dp) => dp.vehicle)
  driver: Driverprofile;

  @OneToMany(() => Payment, (payment) => payment.vehicle)
  payments: Payment[];

  @Column()
  vehicleImage: string;
  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  plateNumber: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  rentalrate: number;

  @Column()
  color: string;

  @Column('int')
  capacity: number;

  @Column()
  year: number;

  @Column({ default: false })
  available: boolean;

  @Column()
  vehicleType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
