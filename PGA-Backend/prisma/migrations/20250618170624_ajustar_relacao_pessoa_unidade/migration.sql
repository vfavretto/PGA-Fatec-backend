-- CreateTable
CREATE TABLE "PessoaUnidade" (
    "pessoa_id" INTEGER NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "data_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PessoaUnidade_pkey" PRIMARY KEY ("pessoa_id","unidade_id")
);

-- AddForeignKey
ALTER TABLE "PessoaUnidade" ADD CONSTRAINT "PessoaUnidade_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaUnidade" ADD CONSTRAINT "PessoaUnidade_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE CASCADE ON UPDATE CASCADE;
