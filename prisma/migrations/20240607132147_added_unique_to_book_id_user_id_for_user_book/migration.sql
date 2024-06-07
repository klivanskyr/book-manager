/*
  Warnings:

  - A unique constraint covering the columns `[bookId,userId]` on the table `User_book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_book_bookId_userId_key" ON "User_book"("bookId", "userId");
