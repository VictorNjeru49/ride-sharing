import { Module } from '@nestjs/common';
import { DriverlocationService } from './driverlocation.service';
import { DriverlocationController } from './driverlocation.controller';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driverlocation } from './entities/driverlocation.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Driverlocation, User])],
  controllers: [DriverlocationController],
  providers: [DriverlocationService],
})
export class DriverlocationModule {}
