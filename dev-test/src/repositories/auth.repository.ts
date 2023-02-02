import {
  ConflictException,
  HttpException,
  HttpStatus,
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
    let user = await this.getUserByEmail(createUserDto.username.toLowerCase());

    if (user) {
      throw new HttpException(
        'The user with such email is already exists!',
        HttpStatus.CONFLICT,
      );
    }

    user = new this.userModel({
      username: createUserDto.username.toLowerCase(),
      password: await this.cryptoService.hashPassword(createUserDto.password),
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

  async validateUser(username: string, password: string) {
    const user = await this.getUserByEmail(username.toLowerCase());

    if (!user) {
      throw new HttpException(
        'The user could not be found!',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordValid = await this.cryptoService.comparePasswords(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user && passwordValid) {
      return user;
    }

    return null;
  }

  async getUserByEmail(username: string) {
    return await this.userModel
      .findOne(
        {
          username,
        },
        ['username', 'password'],
      )
      .exec();
  }
}
