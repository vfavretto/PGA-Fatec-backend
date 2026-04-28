import { TipoUsuario } from '@prisma/client';

export interface LoginPayload {
  pessoa_id: string;
  email: string;
  nome: string;
  tipo_usuario: TipoUsuario;
}
