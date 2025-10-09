import { Controller, Get ,Render} from '@nestjs/common';
import { AppService } from './app.service.js';
import * as dotenv from 'dotenv';
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
  @Get()
  @Render('index') // Tự động render views/index.hbs
  getHome() {
    return {
      title: 'Trang chủ',
      name: 'Tuấn', // biến truyền vào view
    };
  }
}
