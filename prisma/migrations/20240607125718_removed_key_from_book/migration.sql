/*
  Warnings:

  - You are about to drop the column `key` on the `Book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Book_key_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "key";
