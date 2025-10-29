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
  async importFromJson(data: any): Promise<Game> {
    const { name, description, platforms, type, offers } = data;

    let existing = await this.gameRepo.findOne({
      where: { name },
      relations: ['offers'],
    });

    if (!existing) {
      existing = this.gameRepo.create({
        name,
        description,
        platforms,
        type,
      });
      existing = await this.gameRepo.save(existing);
    } else {
      existing.description = description;
      existing.platforms = platforms;
      existing.type = type;
      existing = await this.gameRepo.save(existing);
    }

    if (Array.isArray(offers)) {
      for (const offerData of offers) {
        const newOffer = this.offerRepo.create({
          ...offerData,
          game: existing,
        });
        await this.offerRepo.save(newOffer);
      }
    }

    return existing;
  }
}
