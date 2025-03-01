/*
  Warnings:

  - You are about to drop the column `reviewAt` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviewAt",
ADD COLUMN     "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
