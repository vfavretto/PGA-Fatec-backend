-- CreateEnum
CREATE TYPE "CargoUnidade" AS ENUM ('AssessorIV', 'ChefeServicoAdministrativo', 'ChefeServicoAcademico', 'AssistenteTecnico', 'PsicologoInstitucional', 'AgenteFacilitadorInova');

-- AlterTable
ALTER TABLE "PessoaUnidade" ADD COLUMN     "cargo" "CargoUnidade";
