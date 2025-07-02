import { PartialType } from '@nestjs/swagger';
import { CreateDriverprofileDto } from './create-driverprofile.dto';

export class UpdateDriverprofileDto extends PartialType(
  CreateDriverprofileDto,
) {}
