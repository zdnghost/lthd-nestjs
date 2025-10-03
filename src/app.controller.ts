import { Controller, Get } from '@nestjs/common';
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
}
