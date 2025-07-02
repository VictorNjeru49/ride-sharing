import { PartialType } from '@nestjs/swagger';
import { CreateRidefeedbackDto } from './create-ridefeedback.dto';

export class UpdateRidefeedbackDto extends PartialType(CreateRidefeedbackDto) {}
