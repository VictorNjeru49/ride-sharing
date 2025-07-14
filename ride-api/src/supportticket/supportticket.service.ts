import { Injectable } from '@nestjs/common';
import { CreateSupportticketDto } from './dto/create-supportticket.dto';
import { UpdateSupportticketDto } from './dto/update-supportticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supportticket } from './entities/supportticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupportticketService {
  constructor(
    @InjectRepository(Supportticket)
    private readonly supportticketRepo: Repository<Supportticket>,
  ) {}

  async create(createSupportticketDto: CreateSupportticketDto) {
    const supportticket = this.supportticketRepo.create(createSupportticketDto);
    return await this.supportticketRepo.save(supportticket);
  }

  async findAll() {
    return await this.supportticketRepo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    return await this.supportticketRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, updateSupportticketDto: UpdateSupportticketDto) {
    await this.supportticketRepo.update(id, updateSupportticketDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.supportticketRepo.delete(id);
  }
}
