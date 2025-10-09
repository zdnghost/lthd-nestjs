import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Game } from './Game.entity.js';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Game', 'offers', { onDelete: 'CASCADE' })
  game: Game;

  @Column({ type: 'varchar', length: 150 })
  sellerName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  url?: string;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  platform?: string;
}
