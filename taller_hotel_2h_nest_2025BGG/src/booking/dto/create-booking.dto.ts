import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsPositive()
  roomId: number;

  // Llegan como string ISO en el JSON; que checkOut > checkIn se valida en el servicio
  @IsDateString()
  checkInDate: Date;

  @IsDateString()
  checkOutDate: Date;
}
