import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import type { Offer } from './Offer.entity.js';
import { User } from './User.entity.js';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-array', nullable: true })
  platforms: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  type?: string;

  @OneToMany('Offer', 'game', { cascade: true, eager: true })
  offers: Offer[];

  @ManyToMany(() => User, (user) => user.favoriteGames)
  favoredByUsers: User[];
}
