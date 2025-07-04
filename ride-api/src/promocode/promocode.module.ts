import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { Userpromousage } from 'src/userpromousage/entities/userpromousage.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocode } from './entities/promocode.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Promocode, Userpromousage]),
  ],
  controllers: [PromocodeController],
  providers: [PromocodeService],
})
export class PromocodeModule {}
