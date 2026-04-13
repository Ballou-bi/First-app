/*
  Warnings:

  - A unique constraint covering the columns `[userId,email]` on the table `emploies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "emploies_userId_email_key" ON "emploies"("userId", "email");
