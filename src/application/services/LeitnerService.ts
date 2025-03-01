import { Card } from "../../domain/entities/Card.ts";
import { Category } from "../../domain/types/Category.ts";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository.ts";

export class LeitnerService {
  private static readonly INTERVALS: Record<Category, number> = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 4,
    FOURTH: 8,
    FIFTH: 16,
    SIXTH: 32,
    SEVENTH: 64,
    DONE: Infinity,
  };

  static async isCardDueForReview(
    card: Card,
    reviewRepository: IReviewRepository,
    targetDate: Date,
  ): Promise<boolean> {
    const lastReviewDate = await reviewRepository.getLastReviewDate(card.id!);
    if (!lastReviewDate) return true;

    const interval = this.INTERVALS[card.category];
    const nextReviewDate = new Date(lastReviewDate);
    nextReviewDate.setHours(lastReviewDate.getHours() + interval * 24);

    return nextReviewDate <= targetDate;
  }

  static sortCardsByPriority(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => {
      const categoryComparison =
        Object.keys(this.INTERVALS).indexOf(a.category) -
        Object.keys(this.INTERVALS).indexOf(b.category);

      if (categoryComparison !== 0) return categoryComparison;

      return (
        new Date(a.lastReviewedAt).getTime() -
        new Date(b.lastReviewedAt).getTime()
      );
    });
  }

  static async updateCardCategory(
    card: Card,
    isCorrect: boolean,
  ): Promise<Card> {
    try {
      card.category = this.getNextCategory(card.category, isCorrect);
      card.lastReviewedAt = new Date();
      return card;
    } catch (error) {
      throw error;
    }
  }

  private static getNextCategory(
    currentCategory: Category,
    isCorrect: boolean,
  ): Category {
    if (!isCorrect) return Category.FIRST;

    switch (currentCategory) {
      case Category.FIRST:
        return Category.SECOND;
      case Category.SECOND:
        return Category.THIRD;
      case Category.THIRD:
        return Category.FOURTH;
      case Category.FOURTH:
        return Category.FIFTH;
      case Category.FIFTH:
        return Category.SIXTH;
      case Category.SIXTH:
        return Category.SEVENTH;
      case Category.SEVENTH:
        return Category.DONE;
      case Category.DONE:
        return Category.DONE;
      default:
        throw new Error(`Invalid category: ${currentCategory}`);
    }
  }
}
