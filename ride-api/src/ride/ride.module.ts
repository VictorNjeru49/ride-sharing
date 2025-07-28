import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Ridecancel } from 'src/ridecancel/entities/ridecancel.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Ride,
      Driverprofile,
      Location,
      Payment,
      Rating,
      Ridecancel,
      Riderprofile,
    ]),
  ],
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
