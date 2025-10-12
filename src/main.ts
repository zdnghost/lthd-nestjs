import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import hbs from 'hbs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const viewPath = join(__dirname, '..', '..', 'view');
  app.set('views', viewPath);
  app.set('view engine', 'hbs');
  hbs.registerPartials(join(viewPath, 'partials'));
  app.set('view options', { layout: 'layouts/main' });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server chạy tại: http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
