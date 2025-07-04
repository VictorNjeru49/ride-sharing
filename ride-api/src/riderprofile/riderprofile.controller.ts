import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RiderprofileService } from './riderprofile.service';
import { CreateRiderprofileDto } from './dto/create-riderprofile.dto';
import { UpdateRiderprofileDto } from './dto/update-riderprofile.dto';

@Controller('riderprofile')
export class RiderprofileController {
  constructor(private readonly riderprofileService: RiderprofileService) {}

  @Post()
  create(@Body() createRiderprofileDto: CreateRiderprofileDto) {
    return this.riderprofileService.create(createRiderprofileDto);
  }

  @Get()
  findAll() {
    return this.riderprofileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riderprofileService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRiderprofileDto: UpdateRiderprofileDto,
  ) {
    return this.riderprofileService.update(id, updateRiderprofileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riderprofileService.remove(id);
  }
}
