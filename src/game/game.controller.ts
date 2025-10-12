import { Controller, Get, Post, Param, Body, Redirect, Render } from '@nestjs/common';
import { GamesService } from './game.service.js';

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
}
