import {Card} from "../../../src/domain/entities/Card";
import {CardService} from "../../../src/domain/services/CardService";
import {Category} from "../../../src/domain/types/Category";

describe('CardService', () => {
    describe('handleAnswerSubmission', () => {
        const card = new Card(
            '1',
            Category.FIRST,
            'What is TDD?',
            'Test Driven Development'
        );

        it('should return true when answer matches exactly', () => {
            const result = CardService.handleAnswerSubmission(
                card,
                'Test Driven Development'
            );
            expect(result).toBe(true);
        });

        it('should return true when answer matches with different case', () => {
            const result = CardService.handleAnswerSubmission(
                card,
                'test driven development'
            );
            expect(result).toBe(true);
        });

        it('should return true when answer matches with extra spaces', () => {
            const result = CardService.handleAnswerSubmission(
                card,
                '  Test   Driven    Development  '
            );
            expect(result).toBe(true);
        });

        it('should return false when answer does not match', () => {
            const result = CardService.handleAnswerSubmission(
                card,
                'Test Driven Design'
            );
            expect(result).toBe(false);
        });

        it('should return true when forceValidation is true regardless of answer', () => {
            const result = CardService.handleAnswerSubmission(
                card,
                'completely wrong answer',
                true
            );
            expect(result).toBe(true);
        });
    });
});