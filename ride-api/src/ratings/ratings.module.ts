import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Ride } from 'src/ride/entities/ride.entity';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Rating, User, Ride])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
