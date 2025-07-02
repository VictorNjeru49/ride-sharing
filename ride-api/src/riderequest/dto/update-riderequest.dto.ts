import { PartialType } from '@nestjs/swagger';
import { CreateRiderequestDto } from './create-riderequest.dto';

export class UpdateRiderequestDto extends PartialType(CreateRiderequestDto) {}
