import { AppDataSource } from '../utils/data-source';
import { User } from '../entities/user.entity';
import { Review, ReviewStatus } from '../entities/review.entity';
import AppError from '../utils/appError';

const userRepository = AppDataSource.getRepository(User);
const reviewRepository = AppDataSource.getRepository(Review);


export const getReviews = async (userId: number) => {

    const dataReviews = await userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.email', 'review.id'])
        .leftJoin('user.reviews', 'review', 'review.isDeleted = false')
        .addSelect(['review.text', 'review.name', 'review.status', 'review.createdAt', 'review.updatedAt'])
        .where('user.id = :id', { id: userId })
        .orderBy('review.createdAt', 'ASC')
        .getOne();

    return dataReviews;

}

export const deleteReview = async (userId: number, reviewID: number) => {
    const review = await reviewRepository.findOne({
        where: { id: reviewID, userId: userId }
    })

    if (!review) {
        throw (new AppError(404, 'Отзыв не найден'));
    }
    review.isDeleted = true;
    review.deletedAt = new Date();
    await reviewRepository.save(review);
}

export const createReview = async (name: string, text: string, status: ReviewStatus, userId: number) => {

    const review = new Review();
    review.userId = userId;
    review.text = text;
    review.name = name;
    review.status = status;
    review.createdAt = new Date();
    review.updatedAt = new Date();
    return await reviewRepository.save(review);
}

export const editReview = async (name: string, text: string, status: ReviewStatus, userId: number, reviewId: number) => {

    const review = await reviewRepository.findOne({
        where: { id: reviewId, userId: userId }
    })
    if (review) {
        review.text = text;
        review.name = name;
        review.status = status;
        review.updatedAt = new Date();

        return await reviewRepository.save(review);
    }
    return 
}