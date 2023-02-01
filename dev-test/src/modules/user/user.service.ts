import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(createUserDto: CreateUserDto, session: ClientSession) {
    return await this.userRepository.registerUser(createUserDto, session);
  }
}
