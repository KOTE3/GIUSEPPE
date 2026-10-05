import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(hotelId: number, createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomsRepository.create({
      ...createRoomDto,
      hotel: { id: hotelId },
    });

    return this.roomsRepository.save(room);
  }

  async findAll(hotelId: number): Promise<Room[]> {
    return this.roomsRepository.find({
      where: { hotel: { id: hotelId } },
    });
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['hotel', 'bookings'],
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    return room;
  }

  async getAvailability(hotelId: number): Promise<Room[]> {
    return this.roomsRepository.find({
      where: { hotel: { id: hotelId }, available: true },
    });
  }

  // Dos rangos se cruzan si uno empieza antes de que el otro termine, y viceversa
  async isAvailableForDateRange(
    roomId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const room = await this.findOne(roomId);

    return !room.bookings.some(
      (booking) =>
        booking.status !== 'cancelled' &&
        new Date(booking.checkInDate) < endDate &&
        new Date(booking.checkOutDate) > startDate,
    );
  }

  async update(id: number, updateData: UpdateRoomDto): Promise<Room> {
    await this.findOne(id); // 404 si no existe

    if (Object.keys(updateData).length > 0) {
      await this.roomsRepository.update(id, updateData);
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.roomsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
