import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DriverlocationService } from './driverlocation.service';
import { CreateDriverlocationDto } from './dto/create-driverlocation.dto';
import { UpdateDriverlocationDto } from './dto/update-driverlocation.dto';

@Controller('driverlocation')
export class DriverlocationController {
  constructor(private readonly driverlocationService: DriverlocationService) {}

  @Post()
  create(@Body() createDriverlocationDto: CreateDriverlocationDto) {
    return this.driverlocationService.create(createDriverlocationDto);
  }

  @Get()
  findAll() {
    return this.driverlocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverlocationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDriverlocationDto: UpdateDriverlocationDto,
  ) {
    return this.driverlocationService.update(id, updateDriverlocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverlocationService.remove(id);
  }
}
