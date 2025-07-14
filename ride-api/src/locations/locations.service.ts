import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepo.create(createLocationDto);
    return await this.locationRepo.save(location);
  }

  async findAll(search?: string): Promise<Location[]> {
    if (search) {
      return this.locationRepo.find({
        where: { address: search },
        order: { address: 'ASC' },
        relations: [
          'ridesPickup',
          'ridesDropoff',
          'requestsPickup',
          'requestsDropoff',
        ],
      });
    }
    return this.locationRepo.find({ order: { address: 'ASC' } });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepo.findOne({
      where: {
        id,
      },
      relations: [
        'ridesPickup',
        'ridesDropoff',
        'requestsPickup',
        'requestsDropoff',
      ],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);
    await this.locationRepo.update(location.id, updateLocationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
