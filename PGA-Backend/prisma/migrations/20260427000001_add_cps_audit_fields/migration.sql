-- AlterTable: adiciona rastreabilidade à revisão CPS no PGA
ALTER TABLE "PGA" ADD COLUMN "cps_aprovador_id" TEXT;
ALTER TABLE "PGA" ADD COLUMN "data_parecer_cps" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_cps_aprovador_id_fkey"
  FOREIGN KEY ("cps_aprovador_id") REFERENCES "Pessoa"("pessoa_id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "PGA_cps_aprovador_id_idx" ON "PGA"("cps_aprovador_id");
