import { Injectable } from '@nestjs/common';
import { CreateRiderprofileDto } from './dto/create-riderprofile.dto';
import { UpdateRiderprofileDto } from './dto/update-riderprofile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Riderprofile } from './entities/riderprofile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RiderprofileService {
  constructor(
    @InjectRepository(Riderprofile)
    private readonly riderprofileRepo: Repository<Riderprofile>,
  ) {}

  async create(createRiderprofileDto: CreateRiderprofileDto) {
    const riderprofile = this.riderprofileRepo.create(createRiderprofileDto);
    return await this.riderprofileRepo.save(riderprofile);
  }

  async findAll() {
    return await this.riderprofileRepo.find();
  }

  async findOne(id: string) {
    return await this.riderprofileRepo.findOne({ where: { id } });
  }

  async update(id: string, updateRiderprofileDto: UpdateRiderprofileDto) {
    await this.riderprofileRepo.update(id, updateRiderprofileDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.riderprofileRepo.delete(id);
  }
}
