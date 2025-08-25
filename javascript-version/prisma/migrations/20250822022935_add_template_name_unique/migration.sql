/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `EmailTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");
