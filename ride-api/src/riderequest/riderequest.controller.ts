import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RiderequestService } from './riderequest.service';
import { CreateRiderequestDto } from './dto/create-riderequest.dto';
import { UpdateRiderequestDto } from './dto/update-riderequest.dto';

@Controller('riderequest')
export class RiderequestController {
  constructor(private readonly riderequestService: RiderequestService) {}

  @Post()
  create(@Body() createRiderequestDto: CreateRiderequestDto) {
    return this.riderequestService.create(createRiderequestDto);
  }

  @Get()
  findAll() {
    return this.riderequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riderequestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRiderequestDto: UpdateRiderequestDto,
  ) {
    return this.riderequestService.update(+id, updateRiderequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riderequestService.remove(+id);
  }
}
