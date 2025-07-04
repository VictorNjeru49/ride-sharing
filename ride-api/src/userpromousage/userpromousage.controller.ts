import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserpromousageService } from './userpromousage.service';
import { CreateUserpromousageDto } from './dto/create-userpromousage.dto';
import { UpdateUserpromousageDto } from './dto/update-userpromousage.dto';

@Controller('userpromousage')
export class UserpromousageController {
  constructor(private readonly userpromousageService: UserpromousageService) {}

  @Post()
  create(@Body() createUserpromousageDto: CreateUserpromousageDto) {
    return this.userpromousageService.create(createUserpromousageDto);
  }

  @Get()
  findAll() {
    return this.userpromousageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userpromousageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserpromousageDto: UpdateUserpromousageDto,
  ) {
    return this.userpromousageService.update(id, updateUserpromousageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userpromousageService.remove(id);
  }
}
