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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('ridecancel')
export class RidecancelController {
  constructor(private readonly ridecancelService: RidecancelService) {}

  @Public()
  @Post()
  create(@Body() createRidecancelDto: CreateRidecancelDto) {
    return this.ridecancelService.create(createRidecancelDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.ridecancelService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridecancelService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRidecancelDto: UpdateRidecancelDto,
  ) {
    return this.ridecancelService.update(id, updateRidecancelDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridecancelService.remove(id);
  }
}
