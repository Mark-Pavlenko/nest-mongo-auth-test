import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { AuthRepository } from '../../repositories/auth.repository';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: AuthRepository) {}

  async registerUser(createUserDto: CreateUserDto, session: ClientSession) {
    return await this.userRepository.registerUser(createUserDto, session);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.getUserByEmail(username);
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new NotAcceptableException('The user could not be found!');
    }

    if (user && passwordValid) {
      return {
        userId: user.id,
        userName: user.username,
      };
    }

    return null;
  }
}
