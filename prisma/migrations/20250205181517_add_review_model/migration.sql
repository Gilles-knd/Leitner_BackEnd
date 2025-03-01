-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "cardId" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
