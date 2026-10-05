import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './room.entity';

@Controller('hotels/:hotelId/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(
    @Param('hotelId') hotelId: string,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomService.create(parseInt(hotelId), createRoomDto);
  }

  @Get()
  async getAllRooms(@Param('hotelId') hotelId: string): Promise<Room[]> {
    return this.roomService.findAll(parseInt(hotelId));
  }

  // Antes de ':id', igual que en HotelController
  @Get('available')
  async getAvailableRooms(@Param('hotelId') hotelId: string): Promise<Room[]> {
    return this.roomService.getAvailability(parseInt(hotelId));
  }

  @Get(':id')
  async getRoom(@Param('id') id: string): Promise<Room> {
    return this.roomService.findOne(parseInt(id));
  }

  @Put(':id')
  async updateRoom(
    @Param('id') id: string,
    @Body() updateData: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomService.update(parseInt(id), updateData);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.roomService.delete(parseInt(id));
    if (!deleted) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return { success: true };
  }
}
