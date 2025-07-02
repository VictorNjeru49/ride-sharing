import { PartialType } from '@nestjs/swagger';
import { CreateSupportticketDto } from './create-supportticket.dto';

export class UpdateSupportticketDto extends PartialType(
  CreateSupportticketDto,
) {}
