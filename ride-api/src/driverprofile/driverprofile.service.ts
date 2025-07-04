import { Injectable } from '@nestjs/common';
import { CreateDriverprofileDto } from './dto/create-driverprofile.dto';
import { UpdateDriverprofileDto } from './dto/update-driverprofile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driverprofile } from './entities/driverprofile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DriverprofileService {
  constructor(
    @InjectRepository(Driverprofile)
    private readonly driverprofileRepo: Repository<Driverprofile>,
  ) {}

  async create(createDriverprofileDto: CreateDriverprofileDto) {
    const driverprofile = this.driverprofileRepo.create(createDriverprofileDto);
    return await this.driverprofileRepo.save(driverprofile);
  }

  async findAll() {
    return await this.driverprofileRepo.find();
  }

  async findOne(id: string) {
    return await this.driverprofileRepo.findOne({ where: { id } });
  }

  async update(id: string, updateDriverprofileDto: UpdateDriverprofileDto) {
    await this.driverprofileRepo.update(id, updateDriverprofileDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.driverprofileRepo.delete(id);
  }
}
