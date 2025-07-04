import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RidecancelService } from './ridecancel.service';
import { CreateRidecancelDto } from './dto/create-ridecancel.dto';
import { UpdateRidecancelDto } from './dto/update-ridecancel.dto';

@Controller('ridecancel')
export class RidecancelController {
  constructor(private readonly ridecancelService: RidecancelService) {}

  @Post()
  create(@Body() createRidecancelDto: CreateRidecancelDto) {
    return this.ridecancelService.create(createRidecancelDto);
  }

  @Get()
  findAll() {
    return this.ridecancelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridecancelService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRidecancelDto: UpdateRidecancelDto,
  ) {
    return this.ridecancelService.update(id, updateRidecancelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridecancelService.remove(id);
  }
}
