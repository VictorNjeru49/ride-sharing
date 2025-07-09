import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => Driverprofile, (dp) => dp.vehicle) driver: Driverprofile;
  @Column()
  vehicleImage: string;
  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  plateNumber: string;

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
