import { ICardRepository } from "../../domain/repositories/ICardRepository";
import { Card } from "../../domain/entities/Card";

export class GetCardsUseCase {
  constructor(private repository: ICardRepository) {}

  async execute(tags?: string[]): Promise<Card[]> {
    return this.repository.findByTags(tags);
  }
}
