import { Module } from '@nestjs/common';
import { RiderequestService } from './riderequest.service';
import { RiderequestController } from './riderequest.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driverprofile } from 'src/driverprofile/entities/driverprofile.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Riderprofile } from 'src/riderprofile/entities/riderprofile.entity';
import { Riderequest } from './entities/riderequest.entity';
import { Ridefeedback } from 'src/ridefeedback/entities/ridefeedback.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Riderequest,
      Driverprofile,
      Location,
      Riderprofile,
      Ridefeedback,
    ]),
  ],
  controllers: [RiderequestController],
  providers: [RiderequestService],
})
export class RiderequestModule {}
