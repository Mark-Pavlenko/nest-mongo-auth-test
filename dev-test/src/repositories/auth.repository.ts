import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../modules/auth/dto/createUser.dto';
import { CryptoService } from '../crypto/crypto.service';

export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async registerUser(createUserDto: CreateUserDto, session: ClientSession) {
    let user = await this.getUserByEmail(createUserDto.username);

    if (user) {
      throw new ConflictException('User already exists');
    }

    user = new this.userModel({
      username: createUserDto.username,
      password: await this.cryptoService.hash(createUserDto.password),
    });

    try {
      user = await user.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new ConflictException('User not created');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    let user;
    try {
      user = await this.userModel
        .findOne({ email }, ['username', 'password'])
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return user;
  }
}
