import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehicleRepo.create(createVehicleDto);
    return await this.vehicleRepo.save(vehicle);
  }

  async findAll() {
    return await this.vehicleRepo.find();
  }

  async findOne(id: string) {
    return await this.vehicleRepo.findOne({ where: { id } });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.vehicleRepo.update(id, updateVehicleDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.vehicleRepo.delete(id);
  }
}
