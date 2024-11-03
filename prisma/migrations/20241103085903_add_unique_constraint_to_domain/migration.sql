/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Domain_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_ownerId_key" ON "Domain"("name", "ownerId");
