import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findById(id: number) {
    return this.userRepository.findById(id);
  }
}
