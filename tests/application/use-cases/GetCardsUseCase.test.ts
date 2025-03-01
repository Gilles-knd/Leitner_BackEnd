import {Card} from "../../../src/domain/entities/Card.ts";
import {GetCardsUseCase} from "../../../src/application/use-cases/GetCardsUseCase.ts";
import {ICardRepository} from "../../../src/domain/repositories/ICardRepository.ts";
import {mock} from "jest-mock-extended";
import {Category} from "../../../src/domain/types/Category.ts";

describe('GetCardsUseCase', () => {
    const mockRepo = mock<ICardRepository>();
    const useCase = new GetCardsUseCase(mockRepo);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get all cards when no tags provided', async () => {
        const expectedCards = [
            new Card("1", Category.FIRST, "Q1", "A1", "tag1"),
            new Card("2", Category.SECOND, "Q2", "A2", "tag2"),
        ];
        mockRepo.findByTags.mockResolvedValue(expectedCards);

        const result = await useCase.execute();
        expect(result).toEqual(expectedCards);
        expect(mockRepo.findByTags).toHaveBeenCalledWith(undefined);
    });

    it('should get cards filtered by tags', async () => {
        const tags = ['tag1', 'tag2'];
        const expectedCards = [
            new Card('1', Category.FIRST, 'Q1', 'A1', 'tag1')
        ];
        mockRepo.findByTags.mockResolvedValue(expectedCards);

        const result = await useCase.execute(tags);
        expect(result).toEqual(expectedCards);
        expect(mockRepo.findByTags).toHaveBeenCalledWith(tags);
    });

    it('should return an empty array ifno matching cards', async() => {
        mockRepo.findByTags.mockResolvedValue([]);
        const result = await useCase.execute(['tagX']);
        expect(result).toEqual([]);
        expect(mockRepo.findByTags).toHaveBeenCalledWith(['tagX']);
    });
});