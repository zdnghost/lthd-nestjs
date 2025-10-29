import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import type { Offer } from './Offer.entity.js';

@Entity('offer_history')
export class OfferHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Offer', 'histories', { onDelete: 'CASCADE' })
  offer: Offer;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  promotionPrice: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn()
  recordedAt: Date;
}
