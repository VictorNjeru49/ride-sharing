import { Injectable } from '@nestjs/common';
import { CreateRidefeedbackDto } from './dto/create-ridefeedback.dto';
import { UpdateRidefeedbackDto } from './dto/update-ridefeedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ridefeedback } from './entities/ridefeedback.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RidefeedbackService {
  constructor(
    @InjectRepository(Ridefeedback)
    private readonly ridefeedbackRepo: Repository<Ridefeedback>,
  ) {}
  async create(createRidefeedbackDto: CreateRidefeedbackDto) {
    const ridefeed = this.ridefeedbackRepo.create(createRidefeedbackDto);
    return await this.ridefeedbackRepo.save(ridefeed);
  }

  async findAll() {
    return await this.ridefeedbackRepo.find({ relations: ['user', 'ride'] });
  }

  async findOne(id: string) {
    return await this.ridefeedbackRepo.findOne({
      where: { id },
      relations: ['user', 'ride'],
    });
  }

  async update(id: string, updateRidefeedbackDto: UpdateRidefeedbackDto) {
    await this.ridefeedbackRepo.update(id, updateRidefeedbackDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.ridefeedbackRepo.delete(id);
  }
}
