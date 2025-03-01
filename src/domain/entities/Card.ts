import { Category } from "../types/Category";

export class Card {
  constructor(
    public readonly id: string | undefined,
    public category: Category,
    public readonly question: string,
    public readonly answer: string,
    public readonly tag?: string,
    public lastReviewedAt: Date = new Date(),
  ) {}
}
