import { Injectable } from '@nestjs/common';
import { CreateRidecancelDto } from './dto/create-ridecancel.dto';
import { UpdateRidecancelDto } from './dto/update-ridecancel.dto';

@Injectable()
export class RidecancelService {
  create(createRidecancelDto: CreateRidecancelDto) {
    return 'This action adds a new ridecancel';
  }

  findAll() {
    return `This action returns all ridecancel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ridecancel`;
  }

  update(id: number, updateRidecancelDto: UpdateRidecancelDto) {
    return `This action updates a #${id} ridecancel`;
  }

  remove(id: number) {
    return `This action removes a #${id} ridecancel`;
  }
}
