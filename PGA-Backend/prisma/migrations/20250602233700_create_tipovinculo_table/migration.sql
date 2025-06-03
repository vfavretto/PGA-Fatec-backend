/*
  Warnings:

  - You are about to drop the column `tipo_vinculo_hae` on the `ProjetoPessoa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjetoPessoa" DROP COLUMN "tipo_vinculo_hae",
ADD COLUMN     "tipo_vinculo_hae_id" INTEGER;

-- DropEnum
DROP TYPE "TipoVinculoHAE";

-- CreateTable
CREATE TABLE "TipoVinculoHAE" (
    "id" SERIAL NOT NULL,
    "sigla" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "detalhes" TEXT,

    CONSTRAINT "TipoVinculoHAE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoVinculoHAE_sigla_key" ON "TipoVinculoHAE"("sigla");

-- AddForeignKey
ALTER TABLE "ProjetoPessoa" ADD CONSTRAINT "ProjetoPessoa_tipo_vinculo_hae_id_fkey" FOREIGN KEY ("tipo_vinculo_hae_id") REFERENCES "TipoVinculoHAE"("id") ON DELETE SET NULL ON UPDATE CASCADE;
