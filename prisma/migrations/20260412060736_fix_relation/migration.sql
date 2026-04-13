/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `emploies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emploies_email_key" ON "emploies"("email");

-- AddForeignKey
ALTER TABLE "emploies" ADD CONSTRAINT "emploies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
