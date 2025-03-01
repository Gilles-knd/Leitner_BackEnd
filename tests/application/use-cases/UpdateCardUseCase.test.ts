import { CardDTO } from "../../../src/application/dtos/CardDTO";
import { Card } from "../../../src/domain/entities/Card";
import { ICardRepository } from "../../../src/domain/repositories/ICardRepository";
import { UpdateCardUseCase } from "../../../src/application/use-cases/UpdateCardUseCase";
import { mock } from "jest-mock-extended";
import { Category } from "../../../src/domain/types/Category";

describe("UpdateCardUseCase", () => {
  const mockRepo = mock<ICardRepository>();
  const useCase = new UpdateCardUseCase(mockRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update an existing card", async () => {
    const existingCard = new Card("1", Category.FIRST, "Old Q", "Old A");
    const dto = new CardDTO("New Q", "New A", "tag");
    const updatedCard = new Card("1", Category.FIRST, "New Q", "New A", "tag");

    mockRepo.findById.mockResolvedValue(existingCard);
    mockRepo.update.mockResolvedValue(updatedCard);

    const result = await useCase.execute("1", dto);
    expect(result).toEqual(updatedCard);
    expect(mockRepo.findById).toHaveBeenCalledWith("1");
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it("should throw error when card not found", async () => {
    mockRepo.findById.mockResolvedValue(null);
    const dto = new CardDTO("Q", "A");

    await expect(useCase.execute("1", dto)).rejects.toThrow("Card not found");
  });
});
