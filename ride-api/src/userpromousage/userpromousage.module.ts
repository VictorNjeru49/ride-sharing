import { Module } from '@nestjs/common';
import { UserpromousageService } from './userpromousage.service';
import { UserpromousageController } from './userpromousage.controller';

@Module({
  controllers: [UserpromousageController],
  providers: [UserpromousageService],
})
export class UserpromousageModule {}
