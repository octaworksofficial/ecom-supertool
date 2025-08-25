/*
  Warnings:

  - You are about to drop the column `categories` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `openingHours` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `priceLevel` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CustomerInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `outcome` on the `CustomerInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CustomerInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CustomerInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CustomerInteraction` table. All the data in the column will be lost.
  - Added the required column `subject` to the `CustomerInteraction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "EmailSend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "customerId" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isHtml" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" DATETIME,
    "firstOpenedAt" DATETIME,
    "lastOpenedAt" DATETIME,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "lastClickedAt" DATETIME,
    "errorMessage" TEXT,
    "trackingId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailSend_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isHtml" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT DEFAULT 'general',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrendyolSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',
    "secretKey" TEXT NOT NULL DEFAULT '',
    "checkInterval" INTEGER NOT NULL DEFAULT 30,
    "openaiApiKey" TEXT NOT NULL DEFAULT '',
    "openaiModel" TEXT NOT NULL DEFAULT 'gpt-4o',
    "assistantId" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("address", "city", "companyName", "contactName", "country", "createdAt", "email", "id", "notes", "phone", "source", "status", "updatedAt", "website") SELECT "address", "city", "companyName", "contactName", "country", "createdAt", "email", "id", "notes", "phone", "source", "status", "updatedAt", "website" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE TABLE "new_CustomerInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerInteraction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CustomerInteraction" ("createdAt", "customerId", "date", "id", "type") SELECT "createdAt", "customerId", "date", "id", "type" FROM "CustomerInteraction";
DROP TABLE "CustomerInteraction";
ALTER TABLE "new_CustomerInteraction" RENAME TO "CustomerInteraction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EmailSend_trackingId_key" ON "EmailSend"("trackingId");
