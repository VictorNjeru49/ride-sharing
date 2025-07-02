import { Module } from '@nestjs/common';
import { SupportticketService } from './supportticket.service';
import { SupportticketController } from './supportticket.controller';

@Module({
  controllers: [SupportticketController],
  providers: [SupportticketService],
})
export class SupportticketModule {}
