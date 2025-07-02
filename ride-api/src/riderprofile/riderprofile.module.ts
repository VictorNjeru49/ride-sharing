import { Module } from '@nestjs/common';
import { RiderprofileService } from './riderprofile.service';
import { RiderprofileController } from './riderprofile.controller';

@Module({
  controllers: [RiderprofileController],
  providers: [RiderprofileService],
})
export class RiderprofileModule {}
