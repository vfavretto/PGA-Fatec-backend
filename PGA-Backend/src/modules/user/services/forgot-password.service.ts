import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { SendPasswordReset } from '../../mail/services/sendPasswordReset.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sendPasswordReset: SendPasswordReset,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    await this.sendPasswordReset.execute(email, token);
  }
}
