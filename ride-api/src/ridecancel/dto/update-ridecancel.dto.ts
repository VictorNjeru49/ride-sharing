import { PartialType } from '@nestjs/swagger';
import { CreateRidecancelDto } from './create-ridecancel.dto';

export class UpdateRidecancelDto extends PartialType(CreateRidecancelDto) {}
