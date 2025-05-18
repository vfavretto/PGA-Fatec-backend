import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userRepository.update(user.pessoa_id, {
        senha: hashedPassword,
      });
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}