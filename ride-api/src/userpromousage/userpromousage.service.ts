import { Injectable } from '@nestjs/common';
import { CreateUserpromousageDto } from './dto/create-userpromousage.dto';
import { UpdateUserpromousageDto } from './dto/update-userpromousage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Userpromousage } from './entities/userpromousage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserpromousageService {
  constructor(
    @InjectRepository(Userpromousage)
    private readonly promousageRepo: Repository<Userpromousage>,
  ) {}
  async create(createUserpromousageDto: CreateUserpromousageDto) {
    const userpromousage = this.promousageRepo.create(createUserpromousageDto);
    return await this.promousageRepo.save(userpromousage);
  }

  async findAll() {
    return await this.promousageRepo.find({
      relations: { user: true, promoCode: true },
    });
  }

  async findOne(id: string) {
    return await this.promousageRepo.findOne({
      where: { id },
      relations: { user: true, promoCode: true },
    });
  }

  async update(id: string, updateUserpromousageDto: UpdateUserpromousageDto) {
    await this.promousageRepo.update(id, updateUserpromousageDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.promousageRepo.delete(id);
  }
}
