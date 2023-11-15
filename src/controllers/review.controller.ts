import { NextFunction, Request, Response } from 'express';
import { User } from "../entities/user.entity";
import { Review } from '../entities/review.entity';
import { getReviews, deleteReview, createReview, editReview } from '../services/review.service';

export const getReviewsHandler = async (
    req: Request<{ userId: number }, {}, User>,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = Number(res.locals.user.id)

        const reviewsByUser = await getReviews(userId);

        if (reviewsByUser) {
            res.status(200).json({
                status: 'success',
                reviewsByUser
            });
        }

    } catch (err: any) {
        next(err);
    }
};

export const deleteReviewHandler = async (
    req: Request<{ reviewId: number }, {}, Review>,
    res: Response,
    next: NextFunction
) => {
    try {
        const reviewID = Number(req.params.reviewId);
        console.log(res.locals, 'res')
        const userId = Number(res.locals.user.id)

        await deleteReview(userId, reviewID)
        res.status(200).json({
            status: 'success'
        });

    } catch (err: any) {
        next(err);
    }
};

export const editReviewHandler = async (
    req: Request<{ reviewId: number }, {}, Review>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { reviewId } = req.params
        const { name, text, status } = req.body;    
        const userId = Number(res.locals.user.id)
        await editReview(name, text, status, userId, reviewId)
        res.status(200).json({
            status: 'success'
        });

    } catch (err: any) {
        next(err);
    }
};

export const createReviewHandler = async (
    req: Request<{ }, {}, Review>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, text, status } = req.body;
        const userId = Number(res.locals.user.id)

        await createReview(name, text, status, userId);
        res.status(200).json({
            status: 'success'
        });

    } catch (err: any) {
        next(err);
    }
};

