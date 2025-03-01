import { ICardRepository } from "../../domain/repositories/ICardRepository";
import db from "../db/prisma";
import { Card } from "../../domain/entities/Card";
import { Category } from "../../domain/types/Category";

export class CardRepository implements ICardRepository {
  async save(card: Card): Promise<Card> {
    const savedCard = await db.card.create({
      data: {
        question: card.question,
        answer: card.answer,
        tag: card.tag ?? null,
      },
    });

    return new Card(
      savedCard.id,
      savedCard.category as Category,
      savedCard.question,
      savedCard.answer,
      savedCard.tag!,
    );
  }

  async findByTags(tags?: string[]): Promise<Card[]> {
    const where = tags ? { tag: { in: tags } } : {};

    const cards = await db.card.findMany({
      where,
      select: {
        id: true,
        question: true,
        answer: true,
        tag: true,
        category: true,
      },
    });

    return cards.map(
      (card) =>
        new Card(
          card.id,
          card.category as Category,
          card.question,
          card.answer,
          card.tag ?? undefined,
        ),
    );
  }

  async findById(id: string): Promise<Card | null> {
    const card = await db.card.findUnique({
      where: { id },
    });

    if (!card) return null;

    return new Card(
      card.id,
      card.category as Category,
      card.question,
      card.answer,
      card.tag ?? undefined,
    );
  }

  async update(card: Card): Promise<Card> {
    const updatedCard = await db.card.update({
      where: { id: card.id },
      data: {
        question: card.question,
        answer: card.answer,
        tag: card.tag ?? null,
        category: card.category,
        lastReviewedAt: new Date(),
      },
    });

    return new Card(
      updatedCard.id,
      updatedCard.category as Category,
      updatedCard.question,
      updatedCard.answer,
      updatedCard.tag ?? undefined,
      updatedCard.lastReviewedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await db.card.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Card[]> {
    const cards = await db.card.findMany();

    return cards.map(
      (card) =>
        new Card(
          card.id,
          card.category as Category,
          card.question,
          card.answer,
          card.tag ?? undefined,
          card.lastReviewedAt,
        ),
    );
  }

  async findSimilar(question: string, answer: string): Promise<Card | null> {
    const normalizedQuestion = question.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    const cards = await db.card.findFirst({
      where: {
        question: {
          equals: normalizedQuestion,
          mode: "insensitive",
        },
        answer: {
          equals: normalizedAnswer,
          mode: "insensitive",
        },
      },
    });

    if (!cards) return null;

    return new Card(
      cards.id,
      cards.category as Category,
      cards.question,
      cards.answer,
      cards.tag ?? undefined,
      cards.lastReviewedAt,
    );
  }
}
