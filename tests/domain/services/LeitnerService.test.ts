import { IReviewRepository } from "../../../src/domain/repositories/IReviewRepository";
import { LeitnerService } from "../../../src/application/services/LeitnerService";
import { Card } from "../../../src/domain/entities/Card";
import { Category } from "../../../src/domain/types/Category";

describe("LeitnerService", () => {
  describe("isCardDueForReview", () => {
    let mockReviewRepository: jest.Mocked<IReviewRepository>;

    beforeEach(() => {
      mockReviewRepository = {
        getLastReviewDate: jest.fn(),
        hasReviewedToday: jest.fn(),
        save: jest.fn(),
      };
    });

    it("should return true if card has never been reviewed", async () => {
      const card = new Card("1", Category.FIRST, "question", "answer");
      mockReviewRepository.getLastReviewDate.mockResolvedValue(null);

      const result = await LeitnerService.isCardDueForReview(
        card,
        mockReviewRepository,
        new Date(),
      );

      expect(result).toBe(true);
    });

    it("should return true if review is due based on category interval", async () => {
      const card = new Card("1", Category.FIRST, "question", "answer");
      const lastReviewDate = new Date();
      lastReviewDate.setDate(lastReviewDate.getDate() - 2); // 2 days ago
      mockReviewRepository.getLastReviewDate.mockResolvedValue(lastReviewDate);

      const result = await LeitnerService.isCardDueForReview(
        card,
        mockReviewRepository,
        new Date(),
      );

      expect(result).toBe(true);
    });

    it("should return false if review is not yet due", async () => {
      const card = new Card(
        "1",
        Category.SECOND, // 2 days interval
        "question",
        "answer",
      );
      const lastReviewDate = new Date();
      lastReviewDate.setDate(lastReviewDate.getDate() - 1); // 1 day ago
      mockReviewRepository.getLastReviewDate.mockResolvedValue(lastReviewDate);

      const result = await LeitnerService.isCardDueForReview(
        card,
        mockReviewRepository,
        new Date(),
      );

      expect(result).toBe(false);
    });
  });

  describe("updateCardCategory", () => {
    it("should move card to next category on correct answer", async () => {
      const card = new Card("1", Category.FIRST, "question", "answer");

      const updatedCard = await LeitnerService.updateCardCategory(card, true);

      expect(updatedCard.category).toBe(Category.SECOND);
    });

    it("should move card to FIRST category on incorrect answer", async () => {
      const card = new Card("1", Category.THIRD, "question", "answer");

      const updatedCard = await LeitnerService.updateCardCategory(card, false);

      expect(updatedCard.category).toBe(Category.FIRST);
    });

    it("should keep card in DONE category on correct answer if already DONE", async () => {
      const card = new Card("1", Category.DONE, "question", "answer");

      const updatedCard = await LeitnerService.updateCardCategory(card, true);

      expect(updatedCard.category).toBe(Category.DONE);
    });
  });

  describe("sortCardsByPriority", () => {
    it("should sort cards by category first", () => {
      const cards = [
        new Card("1", Category.THIRD, "q1", "a1"),
        new Card("2", Category.FIRST, "q2", "a2"),
        new Card("3", Category.SECOND, "q3", "a3"),
      ];

      const sortedCards = LeitnerService.sortCardsByPriority(cards);

      expect(sortedCards[0].category).toBe(Category.FIRST);
      expect(sortedCards[1].category).toBe(Category.SECOND);
      expect(sortedCards[2].category).toBe(Category.THIRD);
    });

    it("should sort by lastReviewedAt when categories are equal", () => {
      const oldDate = new Date("2024-01-01");
      const newDate = new Date("2024-01-02");

      const cards = [
        new Card("1", Category.FIRST, "q1", "a1", undefined, newDate),
        new Card("2", Category.FIRST, "q2", "a2", undefined, oldDate),
      ];

      const sortedCards = LeitnerService.sortCardsByPriority(cards);

      expect(sortedCards[0].id).toBe("2");
      expect(sortedCards[1].id).toBe("1");
    });
  });
});
