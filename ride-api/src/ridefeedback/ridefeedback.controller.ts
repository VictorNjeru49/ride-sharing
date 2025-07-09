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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('ridefeedback')
export class RidefeedbackController {
  constructor(private readonly ridefeedbackService: RidefeedbackService) {}

  @Public()
  @Post()
  create(@Body() createRidefeedbackDto: CreateRidefeedbackDto) {
    return this.ridefeedbackService.create(createRidefeedbackDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.ridefeedbackService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridefeedbackService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRidefeedbackDto: UpdateRidefeedbackDto,
  ) {
    return this.ridefeedbackService.update(id, updateRidefeedbackDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridefeedbackService.remove(id);
  }
}
