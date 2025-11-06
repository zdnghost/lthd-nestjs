import { Module } from '@nestjs/common';
import { GameController } from './game.controller.js';
import { GamesService } from './game.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/Game.entity.js';
import { Offer } from '../entities/Offer.entity.js';
import { ScraperService } from '../utils/scraper.js';
import { OfferHistory } from '../entities/OfferHistory.entity.js';
import { User } from '../entities/User.entity.js';
@Module({
  imports: [TypeOrmModule.forFeature([Game, User, Offer, OfferHistory])],
  controllers: [GameController],
  providers: [GamesService, ScraperService],
  exports: [GamesService],
})
export class GameModule {}
