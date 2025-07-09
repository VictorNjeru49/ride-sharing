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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('driverlocation')
export class DriverlocationController {
  constructor(private readonly driverlocationService: DriverlocationService) {}

  @Public()
  @Post()
  create(@Body() createDriverlocationDto: CreateDriverlocationDto) {
    return this.driverlocationService.create(createDriverlocationDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.driverlocationService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverlocationService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDriverlocationDto: UpdateDriverlocationDto,
  ) {
    return this.driverlocationService.update(id, updateDriverlocationDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverlocationService.remove(id);
  }
}
