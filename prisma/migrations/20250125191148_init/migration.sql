-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'DONE');

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
