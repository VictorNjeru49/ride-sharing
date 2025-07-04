import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const device = this.deviceRepo.create(createDeviceDto);
    return await this.deviceRepo.save(device);
  }

  async findAll() {
    return await this.deviceRepo.find();
  }

  async findOne(id: string) {
    return await this.deviceRepo.findOne({ where: { id } });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    await this.deviceRepo.update(id, updateDeviceDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.deviceRepo.delete(id);
  }
}
