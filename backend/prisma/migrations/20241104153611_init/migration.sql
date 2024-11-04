/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Joueur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Joueur_username_key" ON "Joueur"("username");
