import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RidefeedbackService } from './ridefeedback.service';
import { CreateRidefeedbackDto } from './dto/create-ridefeedback.dto';
import { UpdateRidefeedbackDto } from './dto/update-ridefeedback.dto';

@Controller('ridefeedback')
export class RidefeedbackController {
  constructor(private readonly ridefeedbackService: RidefeedbackService) {}

  @Post()
  create(@Body() createRidefeedbackDto: CreateRidefeedbackDto) {
    return this.ridefeedbackService.create(createRidefeedbackDto);
  }

  @Get()
  findAll() {
    return this.ridefeedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridefeedbackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRidefeedbackDto: UpdateRidefeedbackDto,
  ) {
    return this.ridefeedbackService.update(+id, updateRidefeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridefeedbackService.remove(+id);
  }
}
