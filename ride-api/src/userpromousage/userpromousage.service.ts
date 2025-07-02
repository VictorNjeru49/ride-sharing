import { Injectable } from '@nestjs/common';
import { CreateUserpromousageDto } from './dto/create-userpromousage.dto';
import { UpdateUserpromousageDto } from './dto/update-userpromousage.dto';

@Injectable()
export class UserpromousageService {
  create(createUserpromousageDto: CreateUserpromousageDto) {
    return 'This action adds a new userpromousage';
  }

  findAll() {
    return `This action returns all userpromousage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userpromousage`;
  }

  update(id: number, updateUserpromousageDto: UpdateUserpromousageDto) {
    return `This action updates a #${id} userpromousage`;
  }

  remove(id: number) {
    return `This action removes a #${id} userpromousage`;
  }
}
