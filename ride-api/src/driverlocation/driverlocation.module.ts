import { Module } from '@nestjs/common';
import { DriverlocationService } from './driverlocation.service';
import { DriverlocationController } from './driverlocation.controller';

@Module({
  controllers: [DriverlocationController],
  providers: [DriverlocationService],
})
export class DriverlocationModule {}
