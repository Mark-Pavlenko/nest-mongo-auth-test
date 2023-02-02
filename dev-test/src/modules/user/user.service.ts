import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../entities/user.entity';
import { Model } from 'mongoose';
import { CryptoService } from '../../crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cryptoService: CryptoService,
  ) {}
  async changePassword(user, changePasswordDto) {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        {
          username: user.username,
        },
        {
          password: await this.cryptoService.hashPassword(
            changePasswordDto.newPassword,
          ),
        },
        { upsert: true, new: true },
      )
      .exec();

    return {
      requestObject: {
        username: updatedUser.username,
        password: updatedUser.password,
      },
      message: 'The password was successfully changed!',
    };
  }
}
