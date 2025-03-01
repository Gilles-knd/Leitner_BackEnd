import { ICardRepository } from "../../domain/repositories/ICardRepository";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { Review } from "../../domain/entities/Review";
import { LeitnerService } from "../services/LeitnerService";
import { AnswerCardDTO } from "../dtos/AnswerCardDTO";
import { GetQuizzCardsUseCase } from "./GetQuizzCardsUseCase";

export class AnswerCardUseCase {
  constructor(
    private cardRepository: ICardRepository,
    private reviewRepository: IReviewRepository,
    private getQuizzCardsUseCase: GetQuizzCardsUseCase,
  ) {}

  async execute(cardId: string, dto: AnswerCardDTO): Promise<void> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasReviewed = await this.reviewRepository.hasReviewedToday(cardId);
    if (hasReviewed) {
      throw new Error("Card already reviewed today");
    }

    const todayCards = await this.getQuizzCardsUseCase.execute();
    const isCardInQuiz = todayCards.some((c) => c.id === cardId);
    if (!isCardInQuiz) {
      throw new Error("Card is not part of today's quiz");
    }

    // Sauvegarder la review
    const review = new Review(
      undefined,
      cardId,
      new Date(),
      dto.isValid,
      false,
    );
    await this.reviewRepository.save(review);

    const updatedCard = await LeitnerService.updateCardCategory(
      card,
      dto.isValid,
    );
    await this.cardRepository.update(updatedCard);
  }
}
