import {Review} from "../../../src/domain/entities/Review.ts";

describe('Review Entity', () => {
    const now = new Date();

    it('should initialize with all properties', () => {
        const review = new Review(
            1,
            'card-id',
            now,
            true,
            false
        );

        expect(review.id).toBe(1);
        expect(review.cardId).toBe('card-id');
        expect(review.reviewedAt).toBe(now);
        expect(review.isCorrect).toBe(true);
        expect(review.forcedValid).toBe(false);
    });

    it('should initialize with optional id', () => {
        const review = new Review(
            undefined,
            'card-id',
            now,
            true,
            false
        );

        expect(review.id).toBeUndefined();
        expect(review.cardId).toBe('card-id');
        expect(review.reviewedAt).toBe(now);
        expect(review.isCorrect).toBe(true);
        expect(review.forcedValid).toBe(false);
    });

    it('should initialize with default forcedValid value', () => {
        const review = new Review(
            1,
            'card-id',
            now,
            true
        );

        expect(review.forcedValid).toBe(false);
    });
});