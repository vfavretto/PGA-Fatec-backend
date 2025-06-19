import { TipoUsuario } from '@prisma/client';

export interface LoginPayload {
  pessoa_id: number;
  email: string;
  nome: string;
  tipo_usuario: TipoUsuario;
}
