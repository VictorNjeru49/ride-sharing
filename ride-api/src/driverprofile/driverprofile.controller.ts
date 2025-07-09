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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('driverprofile')
export class DriverprofileController {
  constructor(private readonly driverprofileService: DriverprofileService) {}

  @Public()
  @Post()
  create(@Body() createDriverprofileDto: CreateDriverprofileDto) {
    return this.driverprofileService.create(createDriverprofileDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.driverprofileService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverprofileService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDriverprofileDto: UpdateDriverprofileDto,
  ) {
    return this.driverprofileService.update(id, updateDriverprofileDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverprofileService.remove(id);
  }
}
