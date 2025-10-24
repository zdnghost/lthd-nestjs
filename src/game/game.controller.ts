import { Controller, Get, Post, Param, Body, Redirect, Render ,Query} from '@nestjs/common';
import { GamesService } from './game.service.js';
import { ScraperService } from '../utils/scraper.js';
import { parseHtmlWithGemini } from '../utils/gemini.js';

@Controller('games')
export class GameController {
    constructor(private readonly games: GamesService) { }


    @Get()
    @Render('games/index')
    async list() {
        const games = await this.games.findAll();
        return { title: 'Game', games };
    }

    @Post()
    @Redirect('/games')
    async create(@Body() body: any) {
        await this.games.create({
            name: body.name,
            description: body.description,
            platforms: body.platforms.split(',').map((p) => p.trim()),
        });
    }

    @Get(':id')
    @Render('games/detail')
    async detail(@Param('id') id: string) {
        const game = await this.games.findOne(id);
        return { game };
    }

    @Post(':id/delete')
    @Redirect('/games')
    async delete(@Param('id') id: string) {
        await this.games.delete(id);
    }

    @Post(':id/offers')
    async addOffer(@Param('id') id: string, @Body() body: any) {
        await this.games.addOffer(id, body);
        return { redirect: `/games/${id}` };
    }
    @Get('scrap')
    async scrapGame(@Query('url') url: string) {
      if (!url) {
        return { error: 'need url query' };
      }
  
      console.log(`🕸️ Scraping from: ${url}`);
  
      const scraper = new ScraperService();
  
      try {
        const html = await scraper.getRawHtml(url);
  
        const gameData = await parseHtmlWithGemini(html);
  
        if (!gameData?.name) {
          throw new Error('parseHtmlWithGemini không trả về dữ liệu hợp lệ');
        }
  
        const savedGame = await this.games.create({
          name: gameData.name,
          description: gameData.description ?? null,
          platforms: Array.isArray(gameData.platforms)
            ? gameData.platforms
            : [gameData.platforms],
          offers: gameData.offers || [],
        });
  
        return {
          message: 'Scraping success',
          game: savedGame,
        };
      } catch (error) {
        console.error('Scraping failed:', error);
        return { error: error.message };
      }
    }
}
