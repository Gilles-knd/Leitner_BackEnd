import { CardRepository } from "../../../src/infrastructure/repositories/CardRepository.ts";
import { Card } from "../../../src/domain/entities/Card.ts";
import { Category } from "../../../src/domain/types/Category.ts";
import db from "../../../src/infrastructure/db/prisma.ts";

describe("CardRepository", () => {
  let repository: CardRepository;

  beforeEach(async () => {
    await db.card.deleteMany();
    repository = new CardRepository();
  });

  describe("save", () => {
    it("should save a new card", async () => {
      const card = new Card(
        undefined,
        Category.FIRST,
        "Test Question",
        "Test Answer",
        "test-tag",
      );

      const savedCard = await repository.save(card);

      expect(savedCard.id).toBeDefined();
      expect(savedCard.question).toBe("Test Question");
      expect(savedCard.category).toBe(Category.FIRST);
    });
  });

  describe("findByTags", () => {
    it("should find cards by tag", async () => {
      await db.card.createMany({
        data: [
          {
            tag: "tag1",
            question: "Q1",
            answer: "A1",
            category: Category.FIRST,
          },
          {
            tag: "tag2",
            question: "Q2",
            answer: "A2",
            category: Category.FIRST,
          },
        ],
      });

      const cards = await repository.findByTags(["tag1"]);
      expect(cards).toHaveLength(1);
      expect(cards[0].tag).toBe("tag1");
    });

    it("should find all cards when no tags provided", async () => {
      await db.card.createMany({
        data: [
          {
            tag: "tag1",
            question: "Q1",
            answer: "A1",
            category: Category.FIRST,
          },
          {
            tag: "tag2",
            question: "Q2",
            answer: "A2",
            category: Category.FIRST,
          },
        ],
      });

      const cards = await repository.findByTags();
      expect(cards).toHaveLength(2);
    });
  });

  describe("update", () => {
    it("should update an existing card", async () => {
      const savedCard = await db.card.create({
        data: {
          question: "Old Q",
          answer: "Old A",
          category: Category.FIRST,
        },
      });

      const updatedCard = await repository.update(
        new Card(savedCard.id, Category.SECOND, "New Q", "New A"),
      );

      expect(updatedCard.question).toBe("New Q");
      expect(updatedCard.category).toBe(Category.SECOND);
    });
  });
});
