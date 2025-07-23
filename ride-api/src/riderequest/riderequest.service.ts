import { Injectable } from '@nestjs/common';
import { CreateRiderequestDto } from './dto/create-riderequest.dto';
import { UpdateRiderequestDto } from './dto/update-riderequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Riderequest } from './entities/riderequest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RiderequestService {
  constructor(
    @InjectRepository(Riderequest)
    private readonly riderequestRepo: Repository<Riderequest>,
  ) {}

  async create(createRiderequestDto: CreateRiderequestDto) {
    const riderequest = this.riderequestRepo.create(createRiderequestDto);
    return await this.riderequestRepo.save(riderequest);
  }

  async findAll() {
    return await this.riderequestRepo.find({
      relations: {
        rider: { user: true },
        assignedDriver: { user: true },
        pickupLocation: true,
        dropoffLocation: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.riderequestRepo.findOne({
      where: { id },
      relations: {
        rider: { user: true },
        assignedDriver: { user: true },
        pickupLocation: true,
        dropoffLocation: true,
      },
    });
  }

  async update(id: string, updateRiderequestDto: UpdateRiderequestDto) {
    await this.riderequestRepo.update(id, updateRiderequestDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.riderequestRepo.delete(id);
  }
}
