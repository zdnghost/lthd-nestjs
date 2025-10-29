import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Game } from './Game.entity.js';
import { OfferHistory } from './OfferHistory.entity.js';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Game', 'offers', { onDelete: 'CASCADE' })
  game: Game;

  @Column({ type: 'varchar', length: 100 , nullable: true})
  shoppingPlatform: string;

  @Column({ type: 'varchar', length: 150 })
  sellerName: string;
  
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  promotionsPrice?: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  url?: string;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  platform?: string;

  @OneToMany(() => OfferHistory, (history) => history.offer)
  histories: OfferHistory[];
}
