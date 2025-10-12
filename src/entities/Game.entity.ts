import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Offer } from './Offer.entity.js';

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'simple-array' })
    platforms: string[];  
  
    @OneToMany('Offer', 'game', { cascade: true, eager: true })
    offers: Offer[];
}
