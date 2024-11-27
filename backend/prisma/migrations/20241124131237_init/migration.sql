/*
  Warnings:

  - Added the required column `avatar` to the `Joueur` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Joueur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "argent" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL
);
INSERT INTO "new_Joueur" ("argent", "id", "password", "username") SELECT "argent", "id", "password", "username" FROM "Joueur";
DROP TABLE "Joueur";
ALTER TABLE "new_Joueur" RENAME TO "Joueur";
CREATE UNIQUE INDEX "Joueur_username_key" ON "Joueur"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
