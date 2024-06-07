/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book_key_key" ON "Book"("key");
