import { Review } from "../../domain/entities/Review.ts";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository.ts";
import db from "../db/prisma.ts";

export class ReviewRepository implements IReviewRepository {
  async save(review: Review): Promise<Review> {
    const savedReview = await db.review.create({
      data: {
        cardId: review.cardId,
        reviewedAt: review.reviewedAt,
        isCorrect: review.isCorrect,
        forcedValid: review.forcedValid,
      },
    });

    return new Review(
      savedReview.id,
      savedReview.cardId,
      savedReview.reviewedAt,
      savedReview.isCorrect,
      savedReview.forcedValid,
    );
  }

  async hasReviewedToday(cardId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const review = await db.review.findFirst({
      where: {
        cardId,
        reviewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return !!review;
  }

  async getLastReviewDate(cardId: string): Promise<Date | null> {
    const review = await db.review.findFirst({
      where: { cardId },
      orderBy: { reviewedAt: "desc" },
    });

    return review ? review.reviewedAt : null;
  }
}
