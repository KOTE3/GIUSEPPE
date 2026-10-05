import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Booking } from '../booking/booking.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: string;

  @Column()
  type: string; // 'single', 'double', 'suite'

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column()
  capacity: number;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: 'CASCADE' })
  hotel: Hotel;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
