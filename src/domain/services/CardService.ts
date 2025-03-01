import {Card} from "../entities/Card.ts";

export class CardService {

    static handleAnswerSubmission(card: Card, submittedAnswer: string, forceValidation: boolean = false): boolean {
        if (forceValidation) {
            return true;
        }
        return this.validateAnswer(card, submittedAnswer);
    }

    private static validateAnswer(card: Card, submittedAnswer: string): boolean {
        const normalizedExpected = this.normalizeAnswer(card.answer);
        const normalizedSubmitted = this.normalizeAnswer(submittedAnswer);

        return normalizedExpected === normalizedSubmitted;
    }

    private static normalizeAnswer(answer: string): string {
        return answer
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');
    }
}