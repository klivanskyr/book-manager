/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_key_key" ON "Book"("key");
