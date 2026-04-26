/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Job` table. All the data in the column will be lost.
  - Added the required column `category` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Job_categoryId_idx";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Job_category_idx" ON "Job"("category");
