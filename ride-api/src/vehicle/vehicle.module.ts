import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Payment } from 'src/payments/entities/payment.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Vehicle, Driverprofile, Payment]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
