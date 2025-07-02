import { PartialType } from '@nestjs/swagger';
import { CreateDriverlocationDto } from './create-driverlocation.dto';

export class UpdateDriverlocationDto extends PartialType(
  CreateDriverlocationDto,
) {}
