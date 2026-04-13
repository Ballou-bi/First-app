/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "emploies" DROP CONSTRAINT "emploies_userId_fkey";

-- DropIndex
DROP INDEX "emploies_email_key";

-- DropTable
DROP TABLE "User";
