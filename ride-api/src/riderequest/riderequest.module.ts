import { Module } from '@nestjs/common';
import { RiderequestService } from './riderequest.service';
import { RiderequestController } from './riderequest.controller';

@Module({
  controllers: [RiderequestController],
  providers: [RiderequestService],
})
export class RiderequestModule {}
