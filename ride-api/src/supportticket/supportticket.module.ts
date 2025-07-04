import { Module } from '@nestjs/common';
import { SupportticketService } from './supportticket.service';
import { SupportticketController } from './supportticket.controller';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supportticket } from './entities/supportticket.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Supportticket, User])],
  controllers: [SupportticketController],
  providers: [SupportticketService],
})
export class SupportticketModule {}
