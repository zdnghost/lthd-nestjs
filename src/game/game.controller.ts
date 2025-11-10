import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Redirect,
  Render,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GamesService } from './game.service.js';
import { ScraperService } from '../utils/scraper.js';
import { parseHtmlWithGemini } from '../utils/gemini.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('games')
export class GameController {
  constructor(
    private readonly games: GamesService,
    private readonly scraper: ScraperService,
  ) {}

  @Get()
  @Render('games/index')
  @UseGuards(AuthGuard('jwt'))
  async list(@Request() req) {
    const user = req.user;
    const games = await this.games.findGamesByUser(user);
    //const games = [];
    return { title: 'Game', games, user };
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
  @Post('import')
  @UseGuards(AuthGuard('jwt'))
  async importGame(@Body('url') url: any, @Request() req) {
    if (!url) {
      return { error: 'URL is required' };
    }
    const user = req.user;
    const scraper = new ScraperService();
    try {
      const html = await scraper.getRawHtml(url);
      const result = await parseHtmlWithGemini(html);

      const game = await this.games.importFromJson(result, user);

      return {
        message: 'Import thành công',
        game,
      };
    } catch (err) {
      return {
        error: 'Import thất bại',
        detail: err.message ?? err,
      };
    }
  }
  @Post('search')
  @UseGuards(AuthGuard('jwt'))
  async searchGames(@Body('query') query: string, @Request() req) {
    if (!query) {
      return { error: 'Query is required' };
    }
    const user = req.user;
    const scraper = new ScraperService();
    try {
      const listUrls = await scraper.getProductLinks(query);
      const maxConcurrent = 3;
      const results: {
        url: string;
        status: string;
        game?: any;
        error?: string;
      }[] = [];
      for (let i = 0; i < listUrls.length; i += maxConcurrent) {
        const chunk = listUrls.slice(i, i + maxConcurrent);
        const batch = chunk.map(async (url) => {
          try {
            const html = await scraper.getRawHtml(url);
            const parsed = await parseHtmlWithGemini(html);
            const game = await this.games.importFromJson(parsed, user);
            return { url, status: 'success', game };
          } catch (err) {
            return { url, status: 'failed', error: err.message };
          }
        });
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
      }

      return {
        message: 'Hoàn tất import hàng loạt',
        total: results.length,
        success: results.filter((r) => r.status === 'success').length,
        failed: results.filter((r) => r.status === 'failed').length,
        results,
      };
    } catch (err) {
      return {
        error: 'Import thất bại',
        detail: err.message ?? err,
      };
    }
  }
}
