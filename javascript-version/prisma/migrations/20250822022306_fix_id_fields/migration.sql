/*
  Warnings:

  - You are about to drop the `customer_interactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "customer_tags_name_key";

-- DropIndex
DROP INDEX "customers_googlePlaceId_key";

-- DropIndex
DROP INDEX "customers_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customer_interactions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customer_tags";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customers";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "categories" TEXT,
    "keywords" TEXT,
    "isOpen" BOOLEAN,
    "coordinates" TEXT,
    "priceLevel" INTEGER,
    "openingHours" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "CustomerInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerInteraction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__CustomerToCustomerTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CustomerToCustomerTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CustomerToCustomerTag_B_fkey" FOREIGN KEY ("B") REFERENCES "CustomerTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CustomerToCustomerTag" ("A", "B") SELECT "A", "B" FROM "_CustomerToCustomerTag";
DROP TABLE "_CustomerToCustomerTag";
ALTER TABLE "new__CustomerToCustomerTag" RENAME TO "_CustomerToCustomerTag";
CREATE UNIQUE INDEX "_CustomerToCustomerTag_AB_unique" ON "_CustomerToCustomerTag"("A", "B");
CREATE INDEX "_CustomerToCustomerTag_B_index" ON "_CustomerToCustomerTag"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTag_name_key" ON "CustomerTag"("name");
