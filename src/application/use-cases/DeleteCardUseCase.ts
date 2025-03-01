import { ICardRepository } from "../../domain/repositories/ICardRepository";

export class DeleteCardUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(id: string): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
