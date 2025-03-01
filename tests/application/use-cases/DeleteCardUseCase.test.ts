import { DeleteCardUseCase } from "../../../src/application/use-cases/DeleteCardUseCase.ts";
import { ICardRepository } from "../../../src/domain/repositories/ICardRepository.ts";
import { mock } from "jest-mock-extended";

describe("DeleteCardUseCase", () => {
  const mockRepo = mock<ICardRepository>();
  const useCase = new DeleteCardUseCase(mockRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a card", async () => {
    await useCase.execute("card-id");
    expect(mockRepo.delete).toHaveBeenCalledWith("card-id");
  });
});
