-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrendyolSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',
    "secretKey" TEXT NOT NULL DEFAULT '',
    "checkInterval" INTEGER NOT NULL DEFAULT 30,
    "openaiApiKey" TEXT NOT NULL DEFAULT '',
    "openaiModel" TEXT NOT NULL DEFAULT 'gpt-4o',
    "openaiMaxTokens" INTEGER NOT NULL DEFAULT 1000,
    "openaiTemperature" REAL NOT NULL DEFAULT 0.7,
    "assistantId" TEXT NOT NULL DEFAULT '',
    "answerTemplate" TEXT NOT NULL DEFAULT 'Merhaba,\n\nSorunuz için teşekkür ederiz. \n\n{answer}\n\nBaşka sorularınız için her zaman buradayız.\n\nİyi günler dileriz.',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrendyolSettings" ("apiKey", "assistantId", "checkInterval", "createdAt", "id", "isActive", "openaiApiKey", "openaiMaxTokens", "openaiModel", "openaiTemperature", "secretKey", "sellerId", "updatedAt") SELECT "apiKey", "assistantId", "checkInterval", "createdAt", "id", "isActive", "openaiApiKey", "openaiMaxTokens", "openaiModel", "openaiTemperature", "secretKey", "sellerId", "updatedAt" FROM "TrendyolSettings";
DROP TABLE "TrendyolSettings";
ALTER TABLE "new_TrendyolSettings" RENAME TO "TrendyolSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
