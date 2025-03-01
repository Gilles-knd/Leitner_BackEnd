import { Card } from "../../../src/domain/entities/Card.ts";
import { ICardRepository } from "../../../src/domain/repositories/ICardRepository.ts";
import { mock } from "jest-mock-extended";
import { Category } from "../../../src/domain/types/Category.ts";
import { AnswerCardUseCase } from "../../../src/application/use-cases/AnswerCardUseCase.ts";
import { IReviewRepository } from "../../../src/domain/repositories/IReviewRepository.ts";
import { GetQuizzCardsUseCase } from "../../../src/application/use-cases/GetQuizzCardsUseCase.ts";
import { AnswerCardDTO } from "../../../src/application/dtos/AnswerCardDTO.ts";
import { LeitnerService } from "../../../src/application/services/LeitnerService.ts";

describe("AnswerCardUseCase", () => {
  const mockCardRepo = mock<ICardRepository>();
  const mockReviewRepo = mock<IReviewRepository>();
  const mockQuizzUseCase = mock<GetQuizzCardsUseCase>();
  const useCase = new AnswerCardUseCase(
    mockCardRepo,
    mockReviewRepo,
    mockQuizzUseCase,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process correct answer successfully", async () => {
    const card = new Card("1", Category.FIRST, "Q", "A");
    const dto = new AnswerCardDTO(true);

    mockCardRepo.findById.mockResolvedValue(card);
    mockReviewRepo.hasReviewedToday.mockResolvedValue(false);
    mockQuizzUseCase.execute.mockResolvedValue([card]);

    const updatedCard = new Card("1", Category.SECOND, "Q", "A");
    jest
      .spyOn(LeitnerService, "updateCardCategory")
      .mockResolvedValue(updatedCard);
    mockCardRepo.update.mockResolvedValue(updatedCard);

    await useCase.execute("1", dto);

    expect(mockReviewRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        cardId: "1",
        isCorrect: true,
        forcedValid: false,
      }),
    );
    expect(mockCardRepo.update).toHaveBeenCalled();
  });

  it("should process incorrect answer", async () => {
    const card = new Card("1", Category.FIRST, "Q", "A");
    const dto = new AnswerCardDTO(false);

    mockCardRepo.findById.mockResolvedValue(card);
    mockReviewRepo.hasReviewedToday.mockResolvedValue(false);
    mockQuizzUseCase.execute.mockResolvedValue([card]);

    const updatedCard = new Card("1", Category.FIRST, "Q", "A");
    jest
      .spyOn(LeitnerService, "updateCardCategory")
      .mockResolvedValue(updatedCard);
    mockCardRepo.update.mockResolvedValue(updatedCard);

    await useCase.execute("1", dto);

    expect(mockReviewRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        cardId: "1",
        isCorrect: false,
        forcedValid: false,
      }),
    );
  });

  it("should prevent multiple reviews of same card in one day", async () => {
    const card = new Card("1", Category.FIRST, "Q", "A");
    const dto = new AnswerCardDTO(true);

    mockCardRepo.findById.mockResolvedValue(card);
    mockReviewRepo.hasReviewedToday.mockResolvedValue(true);

    await expect(useCase.execute("1", dto)).rejects.toThrow(
      "Card already reviewed today",
    );
  });

  it("should throw error if card is not in today's quiz", async () => {
    const card = new Card("1", Category.FIRST, "Q", "A");
    const dto = new AnswerCardDTO(true);

    mockCardRepo.findById.mockResolvedValue(card);
    mockReviewRepo.hasReviewedToday.mockResolvedValue(false);
    mockQuizzUseCase.execute.mockResolvedValue([]);

    await expect(useCase.execute("1", dto)).rejects.toThrow(
      "Card is not part of today's quiz",
    );
  });

  it("should throw error if card not found", async () => {
    const dto = new AnswerCardDTO(true);
    mockCardRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("1", dto)).rejects.toThrow("Card not found");
  });
});
