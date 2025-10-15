import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileURLToPath, } from 'url';
import { GameModule } from './game/game.module.js';
import { OfferModule } from './offer/offer.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { MiddlewareConsumer,  RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './auth/auth.middleware.js';
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
    AuthModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET, 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'login', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
}
}