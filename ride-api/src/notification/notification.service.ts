import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, NotifyStatus } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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

  async createWelcomeNotification(user: User): Promise<void> {
    const existing = await this.notificationRepo.findOne({
      where: {
        user: { id: user.id },
        message:
          'Welcome to RideShare! Get started by booking your first ride.',
      },
    });

    if (!existing) {
      const notification = this.notificationRepo.create({
        user,
        type: NotifyStatus.SYSTEM,
        message:
          'Welcome to RideShare! Get started by booking your first ride.',
      });

      await this.notificationRepo.save(notification);
    }
  }

  async findAll() {
    return await this.notificationRepo.find({
      relations: { user: true },
    });
  }

  async findOne(id: string) {
    return await this.notificationRepo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.notificationRepo.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.notificationRepo.delete(id);
  }
}
