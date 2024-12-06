/*
  Warnings:

  - You are about to alter the column `indicesUtilises` on the `Partie` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joueurId" INTEGER NOT NULL,
    "nbQuestions" INTEGER NOT NULL,
    "indicesUtilises" INTEGER NOT NULL,
    CONSTRAINT "Partie_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "Joueur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("id", "indicesUtilises", "joueurId", "nbQuestions") SELECT "id", "indicesUtilises", "joueurId", "nbQuestions" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
