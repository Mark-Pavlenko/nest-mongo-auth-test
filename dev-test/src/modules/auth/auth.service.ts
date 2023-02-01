import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { AuthRepository } from '../../repositories/auth.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: AuthRepository) {}

  async registerUser(createUserDto: CreateUserDto, session: ClientSession) {
    return await this.userRepository.registerUser(createUserDto, session);
  }
}
