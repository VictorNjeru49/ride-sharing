import { Module } from '@nestjs/common';
import { UserpromousageService } from './userpromousage.service';
import { UserpromousageController } from './userpromousage.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Userpromousage } from './entities/userpromousage.entity';
import { Promocode } from 'src/promocode/entities/promocode.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Userpromousage, Promocode, User]),
  ],
  controllers: [UserpromousageController],
  providers: [UserpromousageService],
})
export class UserpromousageModule {}
