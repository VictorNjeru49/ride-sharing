import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Device, User])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
