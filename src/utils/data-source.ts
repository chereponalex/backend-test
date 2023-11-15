require('dotenv').config()
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';

const postgresConfig = config.get<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}>('postgresConfig');

// запустить миграции
// node ./node_modules/typeorm/cli migration:generate build/src/migrations/added-entity -d build/src/utils/data-source.js
// node ./node_modules/typeorm/cli migration:run -d build/src/utils/data-source.js

export const AppDataSource = new DataSource({
    ...postgresConfig,
    type: 'postgres',
    synchronize: false,
    logging: false,
    entities: process.env.NODE_ENV === "production"
        ? ['build/src/entities/**/*.entity{.ts,.js}']
        : ['src/entities/**/*.entity{.ts,.js}'],
    migrations: process.env.NODE_ENV === "production"
        ? ['build/src/migrations/**/*{.ts,.js}']
        : ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

