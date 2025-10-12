import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileURLToPath, } from 'url';
import { GameController } from './game/game.controller.js';
import { OfferController } from './offer/offer.controller.js';
import { OfferService } from './offer/offer.service.js';
import { GamesService } from './game/game.service.js';
import { GameModule } from './game/game.module.js';
import { OfferModule } from './offer/offer.module.js';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    GameModule,
    OfferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
