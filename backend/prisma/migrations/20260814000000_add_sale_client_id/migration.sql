-- AlterTable: Add clientId to Sale for idempotency
ALTER TABLE "Sale" ADD COLUMN "clientId" VARCHAR(100);

-- CreateIndex: Unique constraint for idempotency (businessId + clientId)
CREATE UNIQUE INDEX "Sale_businessId_clientId_key" ON "Sale"("businessId", "clientId");
