import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import hbs from 'hbs';
import cookieParser from 'cookie-parser';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

hbs.registerHelper('multiply', (a, b) => {
  // Helper để nhân (cho animation delay)
  return a * b;
});

hbs.registerHelper('eq', (a, b) => {
  // Helper để so sánh
  return a === b;
});
hbs.registerHelper('json', (context) => {
  // Helper RẤT hữu ích để debug
  // Giúp bạn in ra object trong file .hbs: {{{json myObject}}}
  return JSON.stringify(context, null, 2);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Thêm cookie-parser middleware
  app.use(cookieParser());

  const viewPath = join(__dirname, '..', '..', 'view');
  const partialsPath = join(viewPath, 'partials');

  app.setBaseViewsDir(viewPath);
  app.useStaticAssets(viewPath);
  app.setViewEngine('hbs');
  hbs.registerPartials(partialsPath);
  app.set('view options', { layout: 'layouts/main' });
  app.set('view cache', false); // Tắt cache Handlebars

  if (process.env.NODE_ENV !== 'production') {
    fs.watch(partialsPath, (eventType, filename) => {
      if (filename && filename.endsWith('.hbs')) {
        console.log(`♻️ Reload partial: ${filename}`);
        hbs.registerPartials(partialsPath);
      }
    });
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Server chạy tại: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

bootstrap();
