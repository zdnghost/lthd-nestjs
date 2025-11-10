import {
  Controller,
  Get,
  Render,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import * as dotenv from 'dotenv';
import { AuthGuard } from '@nestjs/passport';

dotenv.config();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    return {
      layout: 'layouts/auth',
      title: 'Đăng nhập',
    };
  }

  @Get('register')
  @Render('register')
  showRegisterForm() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng ký',
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  @Render('index')
  getHome(@Request() req) {
    // req.user được gán bởi JWT Strategy sau khi verify token thành công
    return {
      title: 'Trang chủ',
      name: req.user?.username || 'Guest',
      user: req.user, // Truyền toàn bộ thông tin user vào view
    };
  }
}
