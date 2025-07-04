import { Module } from '@nestjs/common';
import { DriverprofileService } from './driverprofile.service';
import { DriverprofileController } from './driverprofile.controller';
import { Driverlocation } from 'src/driverlocation/entities/driverlocation.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driverprofile } from './entities/driverprofile.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Driverprofile,
      Driverlocation,
      User,
      Vehicle,
      Ride,
      Riderequest,
    ]),
  ],
  controllers: [DriverprofileController],
  providers: [DriverprofileService],
})
export class DriverprofileModule {}
