import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(createNotificationDto);
    return await this.notificationRepo.save(notification);
  }

  async findAll() {
    return await this.notificationRepo.find();
  }

  async findOne(id: string) {
    return await this.notificationRepo.findOne({ where: { id } });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.notificationRepo.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.notificationRepo.delete(id);
  }
}
