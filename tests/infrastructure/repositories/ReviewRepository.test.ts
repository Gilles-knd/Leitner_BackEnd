
import {ReviewRepository} from "../../../src/infrastructure/repositories/ReviewRepository.ts";
import { Review } from "../../../src/domain/entities/Review.ts";
import { Category } from "../../../src/domain/types/Category.ts";
import db from "../../../src/infrastructure/db/prisma.ts";

describe('ReviewRepository', () => {
    let repository: ReviewRepository;
    let testCard: any;

    beforeEach(async () => {
        await db.review.deleteMany();
        await db.card.deleteMany();

        testCard = await db.card.create({
            data: {
                question: 'Q',
                answer: 'A',
                category: Category.FIRST
            }
        });

        repository = new ReviewRepository();
    });

    describe('save', () => {
        it('should save a new review', async () => {
            const review = new Review(
                undefined,
                testCard.id,
                new Date(),
                true,
                false
            );

            const savedReview = await repository.save(review);

            expect(savedReview.id).toBeDefined();
            expect(savedReview.cardId).toBe(testCard.id);
            expect(savedReview.isCorrect).toBe(true);
        });
    });

    describe('hasReviewedToday', () => {
        it('should return true if card was reviewed today', async () => {
            await db.review.create({
                data: {
                    cardId: testCard.id,
                    reviewedAt: new Date(),
                    isCorrect: true,
                    forcedValid: false
                }
            });

            const hasReviewed = await repository.hasReviewedToday(testCard.id);
            expect(hasReviewed).toBe(true);
        });

        it('should return false if card was not reviewed today', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            await db.review.create({
                data: {
                    cardId: testCard.id,
                    reviewedAt: yesterday,
                    isCorrect: true,
                    forcedValid: false
                }
            });

            const hasReviewed = await repository.hasReviewedToday(testCard.id);
            expect(hasReviewed).toBe(false);
        });
    });

    describe('getLastReviewDate', () => {
        it('should return the most recent review date', async () => {
            const oldDate = new Date('2024-01-01');
            const newDate = new Date('2024-01-02');

            await db.review.createMany({
                data: [
                    {
                        cardId: testCard.id,
                        reviewedAt: oldDate,
                        isCorrect: true,
                        forcedValid: false
                    },
                    {
                        cardId: testCard.id,
                        reviewedAt: newDate,
                        isCorrect: true,
                        forcedValid: false
                    }
                ]
            });

            const lastReviewDate = await repository.getLastReviewDate(testCard.id);
            expect(lastReviewDate?.toISOString()).toBe(newDate.toISOString());
        });

        it('should return null if card was never reviewed', async () => {
            const lastReviewDate = await repository.getLastReviewDate('non-existent-id');
            expect(lastReviewDate).toBeNull();
        });
    });
});