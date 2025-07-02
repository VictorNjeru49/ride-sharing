import { PartialType } from '@nestjs/swagger';
import { CreateUserpromousageDto } from './create-userpromousage.dto';

export class UpdateUserpromousageDto extends PartialType(
  CreateUserpromousageDto,
) {}
