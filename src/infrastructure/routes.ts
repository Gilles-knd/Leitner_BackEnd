import express from "express";
import { CardController } from "./controllers/CardController";
import { CardRepository } from "./repositories/CardRepository";
import { CreateCardUseCase } from "../application/use-cases/CreateCardUseCase";
import { GetCardsUseCase } from "../application/use-cases/GetCardsUseCase";
import { UpdateCardUseCase } from "../application/use-cases/UpdateCardUseCase";
import { DeleteCardUseCase } from "../application/use-cases/DeleteCardUseCase";
import { GetQuizzCardsUseCase } from "../application/use-cases/GetQuizzCardsUseCase";
import { ReviewRepository } from "./repositories/ReviewRepository";
import { AnswerCardUseCase } from "../application/use-cases/AnswerCardUseCase";

export const initRoutes = (app: express.Express) => {
  const cardRepository = new CardRepository();
  const reviewRepository = new ReviewRepository();

  const createCardUseCase = new CreateCardUseCase(cardRepository);
  const getCardsUseCase = new GetCardsUseCase(cardRepository);
  const updateCardUseCase = new UpdateCardUseCase(cardRepository);
  const deleteCardUseCase = new DeleteCardUseCase(cardRepository);
  const getQuizzCardsUseCase = new GetQuizzCardsUseCase(
    cardRepository,
    reviewRepository,
  );
  const answerCardUseCase = new AnswerCardUseCase(
    cardRepository,
    reviewRepository,
    getQuizzCardsUseCase,
  );

  const cardController = new CardController(
    createCardUseCase,
    getCardsUseCase,
    updateCardUseCase,
    deleteCardUseCase,
    getQuizzCardsUseCase,
    answerCardUseCase,
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ data: "alive" });
  });

  app.post("/cards", cardController.create.bind(cardController));
  app.get("/cards", cardController.getAll.bind(cardController));
  app.put("/cards/:cardId", cardController.update.bind(cardController));
  app.delete("/cards/:cardId", cardController.delete.bind(cardController));
  app.get("/cards/quizz", cardController.getQuizz.bind(cardController));
  app.patch(
    "/cards/:cardId/answer",
    cardController.answer.bind(cardController),
  );
};
