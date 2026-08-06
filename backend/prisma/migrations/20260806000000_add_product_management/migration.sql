-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable: Category
ALTER TABLE "Category" ADD COLUMN "color" VARCHAR(7),
ADD COLUMN "icon" VARCHAR(50),
ADD COLUMN "deletedAt" TIMESTAMP(3);

-- AlterTable: Unit
ALTER TABLE "Unit" ADD COLUMN "description" TEXT,
ADD COLUMN "deletedAt" TIMESTAMP(3);

-- AlterTable: Product
ALTER TABLE "Product" DROP COLUMN "baseCost",
DROP COLUMN "overheadCost",
ADD COLUMN "brand" VARCHAR(100),
ADD COLUMN "buyingPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "quantityPurchased" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "transportationCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "loadingCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "packagingCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "storageCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "laborCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "customsCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "otherCosts" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "vatPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN "profitPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN "manualSellingPrice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "reorderLevel" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "maxStock" INTEGER,
ADD COLUMN "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex: Product status
CREATE INDEX "Product_businessId_status_idx" ON "Product"("businessId", "status");

-- CreateTable: ProductImage
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(200),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
