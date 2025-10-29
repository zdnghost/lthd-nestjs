import { Module } from '@nestjs/common';
import { GameController } from './game.controller.js';
import { GamesService } from './game.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/Game.entity.js';
import { Offer } from '../entities/Offer.entity.js';
import { ScraperService } from '../utils/scraper.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game, Offer]),
      ],
    controllers: [GameController],
    providers: [GamesService,ScraperService],
    exports: [GamesService],
})
export class GameModule { }
