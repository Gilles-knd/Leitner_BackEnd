import { ICardRepository } from "../../domain/repositories/ICardRepository.ts";

export class DeleteCardUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(id: string): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
