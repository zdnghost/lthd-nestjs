// data-source.ts
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entitiesPath = path.join(__dirname, 'src/entities/*.entity.{ts,js}');
const migrationsPath = path.join(__dirname, 'src/migrations/*.{ts,js}');

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [entitiesPath],     
  migrations: [migrationsPath],
  synchronize: true,
});

