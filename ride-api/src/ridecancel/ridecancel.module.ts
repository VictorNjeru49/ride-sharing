import { Module } from '@nestjs/common';
import { RidecancelService } from './ridecancel.service';
import { RidecancelController } from './ridecancel.controller';

@Module({
  controllers: [RidecancelController],
  providers: [RidecancelService],
})
export class RidecancelModule {}
