import { Injectable } from '@nestjs/common';
import { CreateRiderprofileDto } from './dto/create-riderprofile.dto';
import { UpdateRiderprofileDto } from './dto/update-riderprofile.dto';

@Injectable()
export class RiderprofileService {
  create(createRiderprofileDto: CreateRiderprofileDto) {
    return 'This action adds a new riderprofile';
  }

  findAll() {
    return `This action returns all riderprofile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} riderprofile`;
  }

  update(id: number, updateRiderprofileDto: UpdateRiderprofileDto) {
    return `This action updates a #${id} riderprofile`;
  }

  remove(id: number) {
    return `This action removes a #${id} riderprofile`;
  }
}
