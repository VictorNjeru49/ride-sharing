import { Module } from '@nestjs/common';
import { DriverprofileService } from './driverprofile.service';
import { DriverprofileController } from './driverprofile.controller';

@Module({
  controllers: [DriverprofileController],
  providers: [DriverprofileService],
})
export class DriverprofileModule {}
