import {Card} from "../../domain/entities/Card.ts";
import {CardDTO} from "../dtos/CardDTO.ts";
import {ICardRepository} from "../../domain/repositories/ICardRepository.ts";

export class UpdateCardUseCase {
    constructor(private cardRepository: ICardRepository) {}

    async execute(cardId: string, dto: CardDTO): Promise<Card> {
        const existingCard = await this.cardRepository.findById(cardId);

        if (!existingCard) {
            throw new Error('Card not found');
        }

        const updatedCard = new Card(
            cardId,
            existingCard.category,
            dto.question,
            dto.answer,
            dto.tag
        );

        return this.cardRepository.update(updatedCard);
    }
}