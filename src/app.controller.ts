import { Controller, Get, Render, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import * as dotenv from 'dotenv';
import { AuthGuard } from '@nestjs/passport';
dotenv.config();
@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }

  constructor(private readonly appService: AppService) { }

  @Get('gemini')
  async getGeminiResponse() {
    return this.appService.askGemini();
  }

  getHello(): string {
    return 'Hello World!';
  }
  @Get()
  @Render('index') // Tự động render views/index.hbs
  getHome() {
    return {
      title: 'Trang chủ',
      name: 'Tuấn', // biến truyền vào view
    };
  }
}
