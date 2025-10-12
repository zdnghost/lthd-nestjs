import { Module } from '@nestjs/common';
import { GameController } from './game.controller.js';
import { GamesService } from './game.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/Game.entity.js';
import { Offer } from '../entities/Offer.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game, Offer]),
      ],
    controllers: [GameController],
    providers: [GamesService],
    exports: [GamesService],
})
export class GameModule { }
