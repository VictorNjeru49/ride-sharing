import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { Riderequest } from 'src/riderequest/entities/riderequest.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Location, Ride, Riderequest]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
