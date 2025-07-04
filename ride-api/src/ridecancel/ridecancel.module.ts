import { Module } from '@nestjs/common';
import { RidecancelService } from './ridecancel.service';
import { RidecancelController } from './ridecancel.controller';
import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ridecancel } from './entities/ridecancel.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Ridecancel, User, Ride])],
  controllers: [RidecancelController],
  providers: [RidecancelService],
})
export class RidecancelModule {}
