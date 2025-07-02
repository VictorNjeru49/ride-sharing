import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupportticketService } from './supportticket.service';
import { CreateSupportticketDto } from './dto/create-supportticket.dto';
import { UpdateSupportticketDto } from './dto/update-supportticket.dto';

@Controller('supportticket')
export class SupportticketController {
  constructor(private readonly supportticketService: SupportticketService) {}

  @Post()
  create(@Body() createSupportticketDto: CreateSupportticketDto) {
    return this.supportticketService.create(createSupportticketDto);
  }

  @Get()
  findAll() {
    return this.supportticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportticketService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupportticketDto: UpdateSupportticketDto,
  ) {
    return this.supportticketService.update(+id, updateSupportticketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportticketService.remove(+id);
  }
}
