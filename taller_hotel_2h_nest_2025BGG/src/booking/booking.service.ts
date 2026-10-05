import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from '../room/room.entity';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    // Sin transform en el ValidationPipe las fechas llegan como string
    const checkInDate = new Date(createBookingDto.checkInDate);
    const checkOutDate = new Date(createBookingDto.checkOutDate);

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('checkOutDate must be after checkInDate');
    }

    const room = await this.roomsRepository.findOne({
      where: { id: createBookingDto.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${createBookingDto.roomId} not found`);
    }
    if (!room.available) {
      throw new BadRequestException(`Room ${room.id} is not available`);
    }

    if (await this.hasDateConflict(room.id, checkInDate, checkOutDate)) {
      throw new BadRequestException('Room is already booked for those dates');
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / MS_PER_DAY);
    const totalPrice = nights * Number(room.pricePerNight);

    const booking = this.bookingsRepository.create({
      checkInDate,
      checkOutDate,
      room: { id: room.id },
      user: { id: userId },
      status: 'pending',
      totalPrice,
    });

    return this.bookingsRepository.save(booking);
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['room', 'user'],
    });
  }

  async findByRoom(roomId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { room: { id: roomId } },
      relations: ['room', 'user'],
    });
  }

  async cancel(id: number): Promise<Booking> {
    await this.findOne(id); // 404 si no existe
    await this.bookingsRepository.update(id, { status: 'cancelled' });
    return this.findOne(id);
  }

  // Choca si existe una reserva activa que empieza antes de mi salida y termina después de mi entrada
  async hasDateConflict(
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    const conflicts = await this.bookingsRepository.find({
      where: {
        room: { id: roomId },
        status: Not('cancelled'),
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
      },
    });

    return conflicts.length > 0;
  }

  // Reservas que se cruzan con el rango (aunque empiecen antes o terminen después)
  async getBookingsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: {
        checkInDate: LessThan(endDate),
        checkOutDate: MoreThan(startDate),
      },
      relations: ['room', 'user'],
    });
  }
}
