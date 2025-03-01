import { Card } from "../entities/Card";

export interface ICardRepository {
  save(card: Card): Promise<Card>;
  findByTags(tags?: string[]): Promise<Card[]>;
  findById(id: string): Promise<Card | null>;
  update(card: Card): Promise<Card>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Card[]>;
  findSimilar(question: string, answer: string): Promise<Card| null>;
}
