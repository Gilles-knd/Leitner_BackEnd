import {ICardRepository} from "../../domain/repositories/ICardRepository.ts";
import {Card} from "../../domain/entities/Card.ts";

export class GetCardsUseCase {
    constructor(private repository: ICardRepository) {}

    async execute(tags?: string[]): Promise<Card[]> {
        return this.repository.findByTags(tags);
    }
}