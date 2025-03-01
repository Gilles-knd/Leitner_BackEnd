import { CardAdapter } from "../../infrastructure/adapters/CardAdapter";
import { ICardRepository } from "../../domain/repositories/ICardRepository";
import { CardDTO } from "../dtos/CardDTO";
import { Card } from "../../domain/entities/Card";

export class CreateCardUseCase {
  constructor(
      private cardRepository: ICardRepository,
  ) {}

  async execute( dto: CardDTO): Promise<Card> {
    const existingCard = await this.cardRepository.findSimilar(dto.question, dto.answer);
    if (existingCard) {
      throw new Error('a similar card already exists');
    }
    const card: Card = CardAdapter.fromDTOtoDomain(dto);
    return this.cardRepository.save(card);
  }
}
