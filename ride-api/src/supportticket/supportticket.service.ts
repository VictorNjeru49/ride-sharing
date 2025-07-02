import { Injectable } from '@nestjs/common';
import { CreateSupportticketDto } from './dto/create-supportticket.dto';
import { UpdateSupportticketDto } from './dto/update-supportticket.dto';

@Injectable()
export class SupportticketService {
  create(createSupportticketDto: CreateSupportticketDto) {
    return 'This action adds a new supportticket';
  }

  findAll() {
    return `This action returns all supportticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supportticket`;
  }

  update(id: number, updateSupportticketDto: UpdateSupportticketDto) {
    return `This action updates a #${id} supportticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} supportticket`;
  }
}
