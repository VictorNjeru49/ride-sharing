import { Injectable } from '@nestjs/common';
import { CreateDriverlocationDto } from './dto/create-driverlocation.dto';
import { UpdateDriverlocationDto } from './dto/update-driverlocation.dto';

@Injectable()
export class DriverlocationService {
  create(createDriverlocationDto: CreateDriverlocationDto) {
    return 'This action adds a new driverlocation';
  }

  findAll() {
    return `This action returns all driverlocation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driverlocation`;
  }

  update(id: number, updateDriverlocationDto: UpdateDriverlocationDto) {
    return `This action updates a #${id} driverlocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} driverlocation`;
  }
}
