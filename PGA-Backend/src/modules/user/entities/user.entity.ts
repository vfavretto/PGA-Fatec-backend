import { TipoUsuario } from '@prisma/client';

export class UserEntity {
  pessoa_id: number;
  nome: string;
  email?: string;
  nome_usuario?: string;
  tipo_usuario: TipoUsuario;
  createdAt?: Date;
}
