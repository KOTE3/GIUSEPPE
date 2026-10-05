import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'confirmed', 'cancelled'

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  room: Room;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;
}
