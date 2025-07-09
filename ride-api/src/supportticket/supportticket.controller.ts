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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('supportticket')
export class SupportticketController {
  constructor(private readonly supportticketService: SupportticketService) {}

  @Public()
  @Post()
  create(@Body() createSupportticketDto: CreateSupportticketDto) {
    return this.supportticketService.create(createSupportticketDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.supportticketService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportticketService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupportticketDto: UpdateSupportticketDto,
  ) {
    return this.supportticketService.update(id, updateSupportticketDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportticketService.remove(id);
  }
}
