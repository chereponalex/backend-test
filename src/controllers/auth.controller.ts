import { NextFunction, Request, Response } from 'express';
import {
    CreateUserInput,
    LoginUserInput,
} from '../schemas/user.schema';
import {
    createUser,
    findUserByEmail,
    signToken,
} from '../services/user.service';
import AppError from '../utils/appError';
import { User } from '../entities/user.entity';

export const registerUserHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password, email } = req.body;

        const newUser = await createUser({
            email: email.toLowerCase(),
            password,
        });

        res.status(201).json({
            status: 'success',
            data: newUser
        });


    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'User with that email already exist',
            });
        }
        next(err);
    }
};

export const loginUserHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { email, password } = req.body;
        const user = await findUserByEmail({ email: email.toLowerCase() });

        if (!user) {
            return next(new AppError(400, 'Invalid email or password'));
        }

        if (!(await User.comparePasswords(password, user.password))) {
            return next(new AppError(400, 'Invalid email or password'));
        }

        const access_token = await signToken(user);

        res.status(200).json({
            status: 'success',
            access_token,
        });
    } catch (err: any) {
        next(err);
    }
};

