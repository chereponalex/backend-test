import express from 'express';
import { checkToken } from "../middleware/checkToken";
import { 
    getReviewsHandler, 
    deleteReviewHandler, 
    editReviewHandler,
    createReviewHandler 
} from '../controllers/review.controller';

const router = express.Router();

router.get('/', checkToken, getReviewsHandler);
router.post('/create', checkToken, createReviewHandler)
router.patch('/edit/:reviewId', checkToken, editReviewHandler);
router.delete('/delete/:reviewId', checkToken, deleteReviewHandler);

export default router;
