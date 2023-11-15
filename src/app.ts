require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import validateEnv from './utils/validateEnv';
import AppError from './utils/appError';
import { AppDataSource } from './utils/data-source';
import authRouter from './routes/auth.routes';
import reviewRouter from './routes/reviews.routes';

const startServer = async () => {
    try {
        await AppDataSource.initialize()
        validateEnv();

        const app = express();

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cookieParser());

        app.use(
            cors({
                origin: config.get<string>('origin'),
                credentials: true,
            })
        );

        app.use('/api/auth', authRouter);
        app.use('/api/reviews', reviewRouter);
        app.all('*', (req: Request, res: Response, next: NextFunction) => {
            next(new AppError(404, `Route ${req.originalUrl} not found`));
        });

        app.use(
            (error: AppError, req: Request, res: Response, next: NextFunction) => {
                error.status = error.status || 'error';
                error.statusCode = error.statusCode || 500;

                res.status(error.statusCode).json({
                    status: error.status,
                    message: error.message,
                });
            }
        );

        const port = config.get<number>('port');
        app.listen(port);

        console.log(`Server started on port: ${port}`);
    } catch (e) {
        console.log('START SERVER FUNC',e);
        setTimeout(startServer, 5000);
    }
}

startServer()