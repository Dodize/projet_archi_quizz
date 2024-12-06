/*
  Warnings:

  - Added the required column `nbBonnesReponses` to the `Partie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joueurId" INTEGER NOT NULL,
    "nbQuestions" INTEGER NOT NULL,
    "nbBonnesReponses" INTEGER NOT NULL,
    "indicesUtilises" INTEGER NOT NULL,
    "categorie" TEXT NOT NULL,
    CONSTRAINT "Partie_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "Joueur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("categorie", "id", "indicesUtilises", "joueurId", "nbQuestions") SELECT "categorie", "id", "indicesUtilises", "joueurId", "nbQuestions" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
