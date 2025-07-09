import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('promocode')
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) {}

  @Public()
  @Post()
  create(@Body() createPromocodeDto: CreatePromocodeDto) {
    return this.promocodeService.create(createPromocodeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.promocodeService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promocodeService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromocodeDto: UpdatePromocodeDto,
  ) {
    return this.promocodeService.update(id, updatePromocodeDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promocodeService.remove(id);
  }
}
