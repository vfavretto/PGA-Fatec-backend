-- AlterEnum
ALTER TYPE "StatusPGA" ADD VALUE 'Publicado';

-- DropForeignKey
ALTER TABLE "PGA" DROP CONSTRAINT "PGA_unidade_id_fkey";

-- AlterTable
ALTER TABLE "PGA" ADD COLUMN     "is_template" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "template_pga_id" TEXT,
ALTER COLUMN "unidade_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PGA_unidade_id_idx" ON "PGA"("unidade_id");

-- CreateIndex
CREATE INDEX "PGA_is_template_idx" ON "PGA"("is_template");

-- CreateIndex
CREATE INDEX "PGA_template_pga_id_idx" ON "PGA"("template_pga_id");

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_template_pga_id_fkey" FOREIGN KEY ("template_pga_id") REFERENCES "PGA"("pga_id") ON DELETE SET NULL ON UPDATE CASCADE;
