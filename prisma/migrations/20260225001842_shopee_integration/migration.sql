-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "discountedPrice" INTEGER;
ALTER TABLE "OrderItem" ADD COLUMN "itemName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "modelName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "originalPrice" INTEGER;
ALTER TABLE "OrderItem" ADD COLUMN "shopeeItemId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "shopeeModelId" TEXT;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN "shopeeModelId" TEXT;
ALTER TABLE "Variant" ADD COLUMN "shopeeTierIdx" TEXT;

-- CreateTable
CREATE TABLE "ShopeeShop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopId" TEXT NOT NULL,
    "shopName" TEXT,
    "region" TEXT NOT NULL DEFAULT 'VN',
    "partnerId" TEXT NOT NULL,
    "partnerKey" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiry" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "message" TEXT,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    CONSTRAINT "SyncLog_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "ShopeeShop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "shopeeStatus" TEXT,
    "shippedAt" DATETIME,
    "deliveredAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "externalId" TEXT,
    "shopeeShopId" INTEGER,
    "shopeeOrderSn" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "buyerUsername" TEXT,
    "recipientName" TEXT,
    "recipientPhone" TEXT,
    "shippingAddress" TEXT,
    "city" TEXT,
    "district" TEXT,
    "ward" TEXT,
    "totalAmount" INTEGER,
    "shippingFee" INTEGER,
    "actualShippingFee" INTEGER,
    "discountAmount" INTEGER,
    "paymentMethod" TEXT,
    "cancelReason" TEXT,
    "messageToSeller" TEXT,
    "note" TEXT,
    "orderedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_shopeeShopId_fkey" FOREIGN KEY ("shopeeShopId") REFERENCES "ShopeeShop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "externalId", "id", "note", "orderedAt", "platform", "status", "updatedAt") SELECT "createdAt", "externalId", "id", "note", "orderedAt", "platform", "status", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_shopeeOrderSn_key" ON "Order"("shopeeOrderSn");
CREATE INDEX "Order_platform_idx" ON "Order"("platform");
CREATE INDEX "Order_orderedAt_idx" ON "Order"("orderedAt");
CREATE INDEX "Order_shopeeShopId_idx" ON "Order"("shopeeShopId");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short" TEXT,
    "description" TEXT,
    "imageHint" TEXT,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "isBest" BOOLEAN NOT NULL DEFAULT false,
    "flashSaleEndsAt" DATETIME,
    "youtubeUrl" TEXT,
    "brandId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "shopeeShopId" INTEGER,
    "shopeeItemId" TEXT,
    "syncedAt" DATETIME,
    "syncStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_shopeeShopId_fkey" FOREIGN KEY ("shopeeShopId") REFERENCES "ShopeeShop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("brandId", "categoryId", "createdAt", "description", "flashSaleEndsAt", "handle", "id", "imageHint", "isBest", "isHot", "short", "title", "updatedAt", "youtubeUrl") SELECT "brandId", "categoryId", "createdAt", "description", "flashSaleEndsAt", "handle", "id", "imageHint", "isBest", "isHot", "short", "title", "updatedAt", "youtubeUrl" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_handle_key" ON "Product"("handle");
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_shopeeShopId_idx" ON "Product"("shopeeShopId");
CREATE UNIQUE INDEX "Product_shopeeShopId_shopeeItemId_key" ON "Product"("shopeeShopId", "shopeeItemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ShopeeShop_shopId_key" ON "ShopeeShop"("shopId");

-- CreateIndex
CREATE INDEX "SyncLog_shopId_idx" ON "SyncLog"("shopId");

-- CreateIndex
CREATE INDEX "SyncLog_type_status_idx" ON "SyncLog"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "Shipment"("orderId");
