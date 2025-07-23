import { Injectable } from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promocode } from './entities/promocode.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromocodeService {
  constructor(
    @InjectRepository(Promocode)
    private readonly promocodeRepo: Repository<Promocode>,
  ) {}

  async create(createPromocodeDto: CreatePromocodeDto) {
    const promocode = this.promocodeRepo.create(createPromocodeDto);
    return await this.promocodeRepo.save(promocode);
  }

  async findAll() {
    return await this.promocodeRepo.find({
      relations: { createdBy: true, usages: true },
    });
  }

  async findOne(id: string) {
    return await this.promocodeRepo.findOne({
      where: { id },
      relations: { createdBy: true, usages: true },
    });
  }

  async update(id: string, updatePromocodeDto: UpdatePromocodeDto) {
    await this.promocodeRepo.update(id, updatePromocodeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.promocodeRepo.delete(id);
  }
}
