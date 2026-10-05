import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  // SQLite no soporta 'timestamp'; CreateDateColumn elige el tipo correcto por BD
  @CreateDateColumn()
  createdAt: Date;

  // El borrado en cascada va en el lado ManyToOne (Booking.user ya tiene onDelete: 'CASCADE')
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
