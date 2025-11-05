import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Redirect,
  Render,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './game.service.js';
import { ScraperService } from '../utils/scraper.js';
import { parseHtmlWithGemini } from '../utils/gemini.js';

@Controller('games')
export class GameController {
  constructor(
    private readonly games: GamesService,
    private readonly scraper: ScraperService,
  ) {}

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
  @Post('import')
  async importGame(@Body('url') url: any) {
    if (!url) {
      return { error: 'URL is required' };
    }
    const scraper = new ScraperService();
    try {
      const html = await scraper.getRawHtml(url);
      const result = await parseHtmlWithGemini(html);
      console.log('Parsed result:', result);
      const game = await this.games.importFromJson(result);

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
  async searchGames(@Body('query') query: string) {
    if (!query) {
      return { error: 'Query is required' };
    }
    try {
      const scraper = new ScraperService();
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
            const game = await this.games.importFromJson(parsed);
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
