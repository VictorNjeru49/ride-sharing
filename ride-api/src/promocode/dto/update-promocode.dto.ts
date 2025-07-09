import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePromocodeDto } from './create-promocode.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePromocodeDto extends PartialType(CreatePromocodeDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
