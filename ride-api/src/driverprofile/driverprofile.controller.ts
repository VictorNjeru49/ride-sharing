import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DriverprofileService } from './driverprofile.service';
import { CreateDriverprofileDto } from './dto/create-driverprofile.dto';
import { UpdateDriverprofileDto } from './dto/update-driverprofile.dto';

@Controller('driverprofile')
export class DriverprofileController {
  constructor(private readonly driverprofileService: DriverprofileService) {}

  @Post()
  create(@Body() createDriverprofileDto: CreateDriverprofileDto) {
    return this.driverprofileService.create(createDriverprofileDto);
  }

  @Get()
  findAll() {
    return this.driverprofileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverprofileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDriverprofileDto: UpdateDriverprofileDto,
  ) {
    return this.driverprofileService.update(+id, updateDriverprofileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverprofileService.remove(+id);
  }
}
