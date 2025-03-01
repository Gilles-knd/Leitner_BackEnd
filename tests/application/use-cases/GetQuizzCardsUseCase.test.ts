import {Card} from "../../../src/domain/entities/Card.ts";
import {ICardRepository} from "../../../src/domain/repositories/ICardRepository.ts";
import {mock} from "jest-mock-extended";
import {Category} from "../../../src/domain/types/Category.ts";
import {IReviewRepository} from "../../../src/domain/repositories/IReviewRepository.ts";
import {GetQuizzCardsUseCase} from "../../../src/application/use-cases/GetQuizzCardsUseCase.ts";
import {LeitnerService} from "../../../src/application/services/LeitnerService.ts";

describe('GetQuizzCardsUseCase', () => {
    const mockCardRepo = mock<ICardRepository>();
    const mockReviewRepo = mock<IReviewRepository>();
    const useCase = new GetQuizzCardsUseCase(mockCardRepo, mockReviewRepo);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get cards due for review', async () => {
        const cards = [
            new Card('1', Category.FIRST, 'Q1', 'A1'),
            new Card('2', Category.SECOND, 'Q2', 'A2')
        ];

        mockCardRepo.findAll.mockResolvedValue(cards);
        mockReviewRepo.hasReviewedToday.mockResolvedValue(false);
        jest.spyOn(LeitnerService, 'isCardDueForReview').mockResolvedValue(true);
        jest.spyOn(LeitnerService, 'sortCardsByPriority').mockReturnValue(cards);

        const result = await useCase.execute();
        expect(result).toEqual(cards);
    });


    it('should throw error for invalid date format', async () => {
        await expect(useCase.execute('invalid-date'))
            .rejects
            .toThrow('Invalid date format');
    });
});
