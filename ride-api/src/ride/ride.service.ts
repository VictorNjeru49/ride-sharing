import { Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepo: Repository<Ride>,
  ) {}

  async create(createRideDto: CreateRideDto) {
    const ride = this.rideRepo.create(createRideDto);
    return await this.rideRepo.save(ride);
  }

  async findAll() {
    return await this.rideRepo.find({
      relations: [
        'rider',
        'driver',
        'pickupLocation',
        'dropoffLocation',
        'payments',
        'ratings',
        'cancellation',
        'feedbacks',
      ],
    });
  }

  async findOne(id: string) {
    return await this.rideRepo.findOne({
      where: { id },
      relations: [
        'rider',
        'driver',
        'pickupLocation',
        'dropoffLocation',
        'payments',
        'ratings',
        'cancellation',
        'feedbacks',
      ],
    });
  }

  async update(id: string, updateRideDto: UpdateRideDto) {
    await this.rideRepo.update(id, updateRideDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.rideRepo.delete(id);
  }
}
