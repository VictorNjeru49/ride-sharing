import { Injectable } from '@nestjs/common';
import { CreateRiderequestDto } from './dto/create-riderequest.dto';
import { UpdateRiderequestDto } from './dto/update-riderequest.dto';

@Injectable()
export class RiderequestService {
  create(createRiderequestDto: CreateRiderequestDto) {
    return 'This action adds a new riderequest';
  }

  findAll() {
    return `This action returns all riderequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} riderequest`;
  }

  update(id: number, updateRiderequestDto: UpdateRiderequestDto) {
    return `This action updates a #${id} riderequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} riderequest`;
  }
}
