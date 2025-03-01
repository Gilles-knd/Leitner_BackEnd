import { Card } from "../../domain/entities/Card";
import { CardDTO } from "../dtos/CardDTO";
import { ICardRepository } from "../../domain/repositories/ICardRepository";

export class UpdateCardUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(cardId: string, dto: CardDTO): Promise<Card> {
    const existingCard = await this.cardRepository.findById(cardId);

    if (!existingCard) {
      throw new Error("Card not found");
    }

    const updatedCard = new Card(
      cardId,
      existingCard.category,
      dto.question,
      dto.answer,
      dto.tag,
    );

    return this.cardRepository.update(updatedCard);
  }
}
