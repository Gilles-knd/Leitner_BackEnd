import { Card } from "../../../src/domain/entities/Card.ts";
import { Category } from "../../../src/domain/types/Category.ts";

describe('Card Entity', () => {
    const now = new Date();

    it('should initialize with all properties', () => {
        const card = new Card(
            '1',
            Category.FIRST,
            'Question',
            'Answer',
            'tag',
            now
        );

        expect(card.id).toBe('1');
        expect(card.category).toBe(Category.FIRST);
        expect(card.question).toBe('Question');
        expect(card.answer).toBe('Answer');
        expect(card.tag).toBe('tag');
        expect(card.lastReviewedAt).toBe(now);
    });

    it('should initialize with optional properties undefined', () => {
        const card = new Card(
            '1',
            Category.FIRST,
            'Question',
            'Answer'
        );

        expect(card.id).toBe('1');
        expect(card.category).toBe(Category.FIRST);
        expect(card.question).toBe('Question');
        expect(card.answer).toBe('Answer');
        expect(card.tag).toBeUndefined();
        expect(card.lastReviewedAt).toBeInstanceOf(Date);
    });

    it('should allow modification of category', () => {
        const card = new Card(
            '1',
            Category.FIRST,
            'Question',
            'Answer'
        );

        card.category = Category.SECOND;
        expect(card.category).toBe(Category.SECOND);
    });
});