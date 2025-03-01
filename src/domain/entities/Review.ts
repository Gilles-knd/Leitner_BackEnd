export class Review {
    constructor(
        public readonly id: number | undefined,
        public readonly cardId: string,
        public readonly reviewedAt: Date,
        public readonly isCorrect: boolean,
        public readonly forcedValid: boolean = false,
    ) {}
}