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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('userpromousage')
export class UserpromousageController {
  constructor(private readonly userpromousageService: UserpromousageService) {}
  @Public()
  @Post()
  create(@Body() createUserpromousageDto: CreateUserpromousageDto) {
    return this.userpromousageService.create(createUserpromousageDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.userpromousageService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userpromousageService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserpromousageDto: UpdateUserpromousageDto,
  ) {
    return this.userpromousageService.update(id, updateUserpromousageDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userpromousageService.remove(id);
  }
}
