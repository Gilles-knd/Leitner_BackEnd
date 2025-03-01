import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { ICardRepository } from "../../domain/repositories/ICardRepository";
import { Card } from "../../domain/entities/Card";
import { LeitnerService } from "../services/LeitnerService";

export class GetQuizzCardsUseCase {
  constructor(
    private cardRepository: ICardRepository,
    private reviewRepository: IReviewRepository,
  ) {}

  async execute(targetDate?: string): Promise<Card[]> {
    const date = targetDate ? new Date(targetDate) : new Date();
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const cards = await this.cardRepository.findAll();
    const filteredCards: Card[] = [];

    for (const card of cards) {
      const hasReviewedToday = await this.reviewRepository.hasReviewedToday(
        card.id!,
      );
      if (hasReviewedToday) continue;

      const isDue = await LeitnerService.isCardDueForReview(
        card,
        this.reviewRepository,
        date,
      );
      if (isDue) {
        filteredCards.push(card);
      }
    }

    return LeitnerService.sortCardsByPriority(filteredCards);
  }
}
