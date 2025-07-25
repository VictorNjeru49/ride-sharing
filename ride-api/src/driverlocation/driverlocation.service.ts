import { Injectable } from '@nestjs/common';
import { CreateDriverlocationDto } from './dto/create-driverlocation.dto';
import { UpdateDriverlocationDto } from './dto/update-driverlocation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driverlocation } from './entities/driverlocation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DriverlocationService {
  constructor(
    @InjectRepository(Driverlocation)
    private readonly driverlocationRepo: Repository<Driverlocation>,
  ) {}

  async create(createDriverlocationDto: CreateDriverlocationDto) {
    const driverlocation = this.driverlocationRepo.create(
      createDriverlocationDto,
    );
    return await this.driverlocationRepo.save(driverlocation);
  }

  async findAll() {
    return await this.driverlocationRepo.find({
      relations: {
        driver: true,
        driverProfile: true,
        riderProfile: true,
        location: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.driverlocationRepo.findOne({
      where: { id },
      relations: {
        driver: true,
        driverProfile: true,
        riderProfile: true,
        location: true,
      },
    });
  }

  async update(id: string, updateDriverlocationDto: UpdateDriverlocationDto) {
    await this.driverlocationRepo.update(id, updateDriverlocationDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.driverlocationRepo.delete(id);
  }
}
