import { Module } from '@nestjs/common';
import { RiderprofileService } from './riderprofile.service';
import { RiderprofileController } from './riderprofile.controller';
import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Riderprofile } from './entities/riderprofile.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Riderprofile, Ride, User, Riderequest]),
  ],
  controllers: [RiderprofileController],
  providers: [RiderprofileService],
})
export class RiderprofileModule {}
