/*
  Warnings:

  - Added the required column `userId` to the `emploies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "emploies_email_key";

-- AlterTable
ALTER TABLE "emploies" ADD COLUMN     "userId" TEXT NOT NULL;
