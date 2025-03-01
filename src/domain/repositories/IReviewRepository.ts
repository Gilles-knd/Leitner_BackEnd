import {Review} from "../entities/Review.ts";

export interface IReviewRepository {
    save(review: Review): Promise<Review>;
    hasReviewedToday(cardId: string): Promise<boolean>;
    getLastReviewDate(cardId: string): Promise<Date | null>;
}