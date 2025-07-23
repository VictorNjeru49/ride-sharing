import { Injectable } from '@nestjs/common';
import { CreateRidecancelDto } from './dto/create-ridecancel.dto';
import { UpdateRidecancelDto } from './dto/update-ridecancel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ridecancel } from './entities/ridecancel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RidecancelService {
  constructor(
    @InjectRepository(Ridecancel)
    private readonly ridecancelRepo: Repository<Ridecancel>,
  ) {}

  async create(createRidecancelDto: CreateRidecancelDto) {
    const ridecancel = this.ridecancelRepo.create(createRidecancelDto);
    return await this.ridecancelRepo.save(ridecancel);
  }

  async findAll() {
    return await this.ridecancelRepo.find({
      relations: { ride: true, user: true },
    });
  }

  async findOne(id: string) {
    return await this.ridecancelRepo.findOne({
      where: { id },
      relations: { ride: true, user: true },
    });
  }

  async update(id: string, updateRidecancelDto: UpdateRidecancelDto) {
    await this.ridecancelRepo.update(id, updateRidecancelDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.ridecancelRepo.delete(id);
  }
}
