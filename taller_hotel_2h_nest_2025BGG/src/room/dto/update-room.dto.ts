import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  // No está en CreateRoomDto, pero el PUT lo envía para marcar la habitación
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
