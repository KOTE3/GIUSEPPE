import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';

// Con Partial<CreateHotelDto> el ValidationPipe no valida nada (es solo un tipo);
// PartialType crea una clase real con las mismas reglas, todas opcionales.
export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
