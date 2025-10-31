import { Controller, Get, Render, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import * as dotenv from 'dotenv';
import { AuthGuard } from '@nestjs/passport';
dotenv.config();
@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get('gemini')
  async getGeminiResponse() {
    return this.appService.askGemini();
  }

  getHello(): string {
    return 'Hello World!';
  }

  @Get('login')
  @Render('login')
  getLogin() {
    return { layout:'layouts/auth',title: 'Đăng nhập' };
  }
  @Get('register')
  @Render('register') // Tạo view mới tên là register.hbs
  showRegisterForm() {
      return { layout: 'layouts/auth', title: 'Đăng ký' };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  @Render('index')
  getHome() {
    return {
      title: 'Trang chủ',
      name: 'Tuấn',
    };
  }

}
