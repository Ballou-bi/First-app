-- CreateTable
CREATE TABLE "emploies" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenoms" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "poste" TEXT NOT NULL,

    CONSTRAINT "emploies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emploies_email_key" ON "emploies"("email");
