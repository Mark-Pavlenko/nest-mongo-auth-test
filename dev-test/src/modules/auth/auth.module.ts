import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../entities/user.entity';
import { AuthRepository } from '../../repositories/auth.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoModule } from '../../crypto/crypto.module';
@Module({
  imports: [
    CryptoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
