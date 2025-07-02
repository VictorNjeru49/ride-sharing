import { Injectable } from '@nestjs/common';
import { CreateDriverprofileDto } from './dto/create-driverprofile.dto';
import { UpdateDriverprofileDto } from './dto/update-driverprofile.dto';

@Injectable()
export class DriverprofileService {
  create(createDriverprofileDto: CreateDriverprofileDto) {
    return 'This action adds a new driverprofile';
  }

  findAll() {
    return `This action returns all driverprofile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driverprofile`;
  }

  update(id: number, updateDriverprofileDto: UpdateDriverprofileDto) {
    return `This action updates a #${id} driverprofile`;
  }

  remove(id: number) {
    return `This action removes a #${id} driverprofile`;
  }
}
