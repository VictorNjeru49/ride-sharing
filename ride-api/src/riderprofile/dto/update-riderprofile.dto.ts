import { PartialType } from '@nestjs/swagger';
import { CreateRiderprofileDto } from './create-riderprofile.dto';

export class UpdateRiderprofileDto extends PartialType(CreateRiderprofileDto) {}
