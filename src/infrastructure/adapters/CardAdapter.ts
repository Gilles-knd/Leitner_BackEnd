import { Card } from "../../domain/entities/Card";
import {CardDTO, CardResponse} from "../../application/dtos/CardDTO";
import { Category } from "../../domain/types/Category";

export class CardAdapter {
  static fromDTOtoDomain(dto: CardDTO): Card {
    return new Card(
        undefined,
        Category.FIRST,
        dto.question,
        dto.answer,
        dto.tag
    );
  }

  static toResponse(card: Card, includeAnswer: boolean = false): CardResponse {
    return {
      id: card.id!,
      category: card.category,
      question: card.question,
      ...(includeAnswer ? { answer: card.answer } : {}),
      tag: card.tag,
    };
  }
}