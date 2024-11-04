/*
  Warnings:

  - You are about to drop the column `mail` on the `Joueur` table. All the data in the column will be lost.
  - Added the required column `indicesUtilises` to the `Partie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbQuestions` to the `Partie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Joueur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "argent" INTEGER NOT NULL
);
INSERT INTO "new_Joueur" ("argent", "id", "password", "username") SELECT "argent", "id", "password", "username" FROM "Joueur";
DROP TABLE "Joueur";
ALTER TABLE "new_Joueur" RENAME TO "Joueur";
CREATE UNIQUE INDEX "Joueur_username_key" ON "Joueur"("username");
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joueurId" INTEGER NOT NULL,
    "nbQuestions" INTEGER NOT NULL,
    "indicesUtilises" BOOLEAN NOT NULL,
    CONSTRAINT "Partie_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "Joueur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("id", "joueurId") SELECT "id", "joueurId" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
