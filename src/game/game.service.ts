import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/Game.entity.js';
import { Offer } from '../entities/Offer.entity.js';


@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
  ) {}

  findAll() {
    return this.gameRepo.find({ relations: ['offers'] });
  }

  findOne(id: string) {
    return this.gameRepo.findOne({ where: { id }, relations: ['offers'] });
  }

  create(data: Partial<Game>) {
    const newGame = this.gameRepo.create(data);
    return this.gameRepo.save(newGame);
  }

  update(id: string, data: Partial<Game>) {
    return this.gameRepo.update(id, data);
  }

  delete(id: string) {
    return this.gameRepo.delete(id);
  }
  async addOffer(gameId: string, data: Partial<Offer>) {
    const game = await this.gameRepo.findOne({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');

    const offer = this.offerRepo.create({
      ...data,
      game,
    });
    return this.offerRepo.save(offer);
  }

}
