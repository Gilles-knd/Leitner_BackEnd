import { mock } from "jest-mock-extended";
import { ICardRepository } from "../../../src/domain/repositories/ICardRepository.ts";
import { CreateCardUseCase } from "../../../src/application/use-cases/CreateCardUseCase.ts";
import { Category } from "../../../src/domain/types/Category.ts";
import { Card } from "../../../src/domain/entities/Card.ts";
import {CardDTO} from "../../../src/application/dtos/CardDTO.ts";

describe("CreateCardUseCase", () => {

  const mockRepo = mock<ICardRepository>();
  const useCase = new CreateCardUseCase(mockRepo);

  it("should create a card with FIRST category if it doesn't exist", async () => {
    const dto = new CardDTO("Question ?", "Réponse", "Tag");

    mockRepo.findSimilar.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(new Card("1", Category.FIRST, dto.question, dto.answer, dto.tag));

    const card = await useCase.execute(dto);
    expect(mockRepo.findSimilar).toHaveBeenCalledWith(dto.question, dto.answer);
    expect(mockRepo.save).toHaveBeenCalled();
    expect(card.question).toBe(dto.question);
    expect(card.answer).toBe(dto.answer);
    expect(card.tag).toBe(dto.tag);
    expect(card.category).toBe(Category.FIRST);
  });

  it("should throw an error if a similar card already exists", async () => {
      const dto = new CardDTO("Question ?", "Réponse", "Tag");
      const existingCard = new Card("1", Category.FIRST, dto.question, dto.answer, dto.tag);

      mockRepo.findSimilar.mockResolvedValue(existingCard);

      await expect(useCase.execute(dto)).rejects.toThrowError('a similar card already exists');
      expect(mockRepo.findSimilar).toHaveBeenCalledWith(dto.question, dto.answer);
      expect(mockRepo.save).not.toHaveBeenCalled();
  });


  it("should create a card without tag", async () => {
      const dto = new CardDTO("Question ?", "Réponse");

      mockRepo.findSimilar.mockResolvedValue(null);
      mockRepo.save.mockResolvedValue(new Card("1", Category.FIRST, dto.question, dto.answer, dto.tag));

      const card = await useCase.execute(dto);

      expect(mockRepo.findSimilar).toHaveBeenCalledWith(dto.question, dto.answer);
      expect(mockRepo.save).toHaveBeenCalled();
      expect(card.question).toBe(dto.question);
      expect(card.answer).toBe(dto.answer);
      expect(card.tag).toBeUndefined();
      expect(card.category).toBe(Category.FIRST);
  });
});