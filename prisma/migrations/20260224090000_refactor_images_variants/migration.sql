/*
  Refactor:
  - Move product images out of Product.imagesJson into File + ProductImage
  - Move pricing/inventory into Variant (Variant.price required, Variant.stock)
  - Remove Product.price / Product.compareAtPrice / Product.imagesJson

  This migration includes a data backfill for existing demo data in sqlite.
*/

PRAGMA foreign_keys=OFF;

-- 1) New tables
CREATE TABLE IF NOT EXISTS "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "mimeType" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'IMAGE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "File_url_key" ON "File"("url");

CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductImage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ProductImage_productId_idx" ON "ProductImage"("productId");
CREATE INDEX IF NOT EXISTS "ProductImage_fileId_idx" ON "ProductImage"("fileId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductImage_productId_fileId_key" ON "ProductImage"("productId", "fileId");

-- 2) Backfill File + ProductImage from Product.imagesJson
--    (SQLite json1 extension is available in this project.)
INSERT OR IGNORE INTO "File" ("url", "kind")
SELECT DISTINCT TRIM(je.value) AS url, 'IMAGE' AS kind
FROM "Product" p
JOIN json_each(p."imagesJson") je
WHERE TRIM(COALESCE(je.value, '')) <> '';

INSERT OR IGNORE INTO "ProductImage" ("productId", "fileId", "sortOrder")
SELECT p."id", f."id", CAST(je.key AS INTEGER)
FROM "Product" p
JOIN json_each(p."imagesJson") je
JOIN "File" f ON f."url" = TRIM(je.value)
WHERE TRIM(COALESCE(je.value, '')) <> '';

-- 3) Variant: add stock, make price required (backfill null prices from Product.price)
ALTER TABLE "Variant" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

UPDATE "Variant"
SET "price" = (SELECT "price" FROM "Product" WHERE "Product"."id" = "Variant"."productId")
WHERE "price" IS NULL;

-- 4) Recreate Variant table to enforce NOT NULL on price
CREATE TABLE "new_Variant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "compareAt" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Variant" ("id","productId","name","value","price","compareAt","stock","sku","sortOrder","createdAt")
SELECT "id","productId","name","value",COALESCE("price",0),"compareAt","stock","sku","sortOrder","createdAt"
FROM "Variant";

DROP TABLE "Variant";
ALTER TABLE "new_Variant" RENAME TO "Variant";

CREATE INDEX "Variant_productId_idx" ON "Variant"("productId");

-- 5) Recreate Product table without price/compareAtPrice/imagesJson
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Product" ("id","handle","title","short","description","imageHint","isHot","isBest","flashSaleEndsAt","youtubeUrl","brandId","categoryId","createdAt","updatedAt")
SELECT "id","handle","title","short","description","imageHint","isHot","isBest","flashSaleEndsAt","youtubeUrl","brandId","categoryId","createdAt","updatedAt"
FROM "Product";

DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";

CREATE UNIQUE INDEX "Product_handle_key" ON "Product"("handle");
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
