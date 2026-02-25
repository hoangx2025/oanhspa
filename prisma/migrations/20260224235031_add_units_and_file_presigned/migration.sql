-- AlterTable
ALTER TABLE "File" ADD COLUMN "key" TEXT;
ALTER TABLE "File" ADD COLUMN "presignedExpiry" DATETIME;
ALTER TABLE "File" ADD COLUMN "presignedUrl" TEXT;

-- CreateTable
CREATE TABLE "Unit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");
