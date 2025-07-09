import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Public()
  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.rideService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rideService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRideDto: UpdateRideDto) {
    return this.rideService.update(id, updateRideDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rideService.remove(id);
  }
}
