import { OfferHistory } from '../entities/OfferHistory.entity.js';
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
    @InjectRepository(OfferHistory)
    private readonly offerHistoryRepo: Repository<OfferHistory>,
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

    // 🔹 Tìm hoặc tạo Game
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
    } else {
      existing.description = description;
      existing.platforms = platforms;
      existing.type = type;
    }

    existing = await this.gameRepo.save(existing);

    // 🔹 Xử lý danh sách Offer
    if (Array.isArray(offers)) {
      for (const offerData of offers) {
        const { sellerName, shoppingPlatform } = offerData;

        if (!sellerName || !shoppingPlatform) continue; // tránh lỗi dữ liệu thiếu

        // Tìm offer theo sellerName + shoppingPlatform + game

        let offer = await this.offerRepo.findOne({
          where: {
            sellerName,
            shoppingPlatform,
            game: { id: existing.id },
          },
          relations: ['histories'],
        });

        if (!offer) {
          let offer = this.offerRepo.create({
            ...offerData,
            game: existing,
          });
          offer = await this.offerRepo.save(offer);
        } else {
          offer.price = offerData.price;
          offer.promotionsPrice = offerData.promotionsPrice;
          offer.currency = offerData.currency;
          offer.platform = offerData.platform;
          offer = await this.offerRepo.save(offer);
        }

        console.log(offer);

        if (offer) {
          const history = this.offerHistoryRepo.create({
            offer,
            price: offer.price,
            promotionPrice: offer.promotionsPrice,
            currency: offer.currency,
            recordedAt: new Date(),
          });
          await this.offerHistoryRepo.save(history);
          console.log('Saved history:', history);
        }
      }
    }

    return existing;
  }
}
