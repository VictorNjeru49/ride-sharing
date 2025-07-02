import { Injectable } from '@nestjs/common';
import { CreateRidefeedbackDto } from './dto/create-ridefeedback.dto';
import { UpdateRidefeedbackDto } from './dto/update-ridefeedback.dto';

@Injectable()
export class RidefeedbackService {
  create(createRidefeedbackDto: CreateRidefeedbackDto) {
    return 'This action adds a new ridefeedback';
  }

  findAll() {
    return `This action returns all ridefeedback`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ridefeedback`;
  }

  update(id: number, updateRidefeedbackDto: UpdateRidefeedbackDto) {
    return `This action updates a #${id} ridefeedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} ridefeedback`;
  }
}
