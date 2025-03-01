import { Request, Response } from "express";
import { CreateCardUseCase } from "../../application/use-cases/CreateCardUseCase";
import { CardDTO } from "../../application/dtos/CardDTO";
import { validateOrReject, ValidationError } from "class-validator";
import { GetCardsUseCase } from "../../application/use-cases/GetCardsUseCase.ts";
import { plainToInstance } from "class-transformer";
import { GetCardsQueryParamsDTO } from "../../application/dtos/GetCardsQueryParams.ts";
import { CardAdapter } from "../adapters/CardAdapter.ts";
import { UpdateCardUseCase } from "../../application/use-cases/UpdateCardUseCase.ts";
import { DeleteCardUseCase } from "../../application/use-cases/DeleteCardUseCase.ts";
import { GetQuizzCardsUseCase } from "../../application/use-cases/GetQuizzCardsUseCase.ts";
import { AnswerCardUseCase } from "../../application/use-cases/AnswerCardUseCase.ts";
import { AnswerCardDTO } from "../../application/dtos/AnswerCardDTO.ts";
export class CardController {
  constructor(
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly getCardsUseCase: GetCardsUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
    private readonly getQuizzCardsUseCase: GetQuizzCardsUseCase,
    private readonly answerCardUseCase: AnswerCardUseCase,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const dto = new CardDTO(req.body.question, req.body.answer, req.body.tag);
      await validateOrReject(dto);

      const card = await this.createCardUseCase.execute(dto);
      res.status(201).json({
        id: card.id,
        category: card.category,
        question: card.question,
        answer: card.answer,
        tag: card.tag,
      });
      return;
    } catch (error: any) {
      if (Array.isArray(error) && error[0] instanceof ValidationError) {
        const validationErrors = error.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}), // Liste des erreurs
        }));

        res.status(400).json({ errors: validationErrors });
        return;
      }
      res.status(400).json({ error: error.message || "Bad request" });
      return;
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const queryParams = plainToInstance(GetCardsQueryParamsDTO, req.query);
      await validateOrReject(queryParams);

      const cards = await this.getCardsUseCase.execute(queryParams.tag);

      res
        .status(200)
        .json(cards.map((card) => CardAdapter.toResponse(card, true)));
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to fetch cards" });
      return;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { cardId } = req.params;
      const dto = new CardDTO(req.body.question, req.body.answer, req.body.tag);
      await validateOrReject(dto);

      const updatedCard = await this.updateCardUseCase.execute(cardId, dto);
      res.status(200).json(CardAdapter.toResponse(updatedCard));
      return;
    } catch (error: any) {
      if (error.message === "Card not found") {
        res.status(404).json({ error: "Card not found" });
        return;
      }
      if (error.message === "Unauthorized access to card") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.status(400).json({ error: error.message || "Invalid request" });
      return;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { cardId } = req.params;

      await this.deleteCardUseCase.execute(cardId);
      res.status(204).send();
      return;
    } catch (error: any) {
      if (error.message === "Card not found") {
        res.status(404).json({ error: "Card not found" });
        return;
      }
      if (error.message === "Unauthorized access to card") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.status(400).json({ error: error.message || "Invalid request" });
      return;
    }
  }

  async getQuizz(req: Request, res: Response) {
    try {
      const targetDate = req.query.date as string | undefined;

      try {
        const cards = await this.getQuizzCardsUseCase.execute(targetDate);

        res
          .status(200)
          .json(cards.map((card) => CardAdapter.toResponse(card, true)));
        return;
      } catch (error: any) {
        if (error.message === "Daily quiz already taken") {
          res.status(403).json({
            error: "You have already taken your quiz today",
          });
          return;
        }
        res.status(400).json({ error: error.message || "Invalid request" });
        return;
      }
    } catch (error: any) {
      if (error.message === "Invalid date format") {
        res.status(400).json({ error: "Invalid date format" });
        return;
      }
      res.status(500).json({
        error: error.message || "Failed to fetch quizz cards",
      });
      return;
    }
  }
  async answer(req: Request, res: Response) {
    try {
      const { cardId } = req.params;
      const dto = new AnswerCardDTO(req.body.isValid);
      await validateOrReject(dto);

      await this.answerCardUseCase.execute(cardId, dto);
      res.status(204).send("Answer has been taken into account");
      return;
    } catch (error: any) {
      if (error.message === "Card not found") {
        res.status(404).json({ error: "Card not found" });
        return;
      }
      if (error.message === "Card is not part of today's quiz") {
        res.status(400).json({ error: "Card is not part of today's quiz" });
        return;
      }
      if (error.message === "Card already reviewed today") {
        res.status(400).json({ error: "Card already reviewed today" });
        return;
      }
      res.status(400).json({ error: error.message || "Bad request" });
      return;
    }
  }
}
