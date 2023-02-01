import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../entities/user.entity';
import { AuthRepository } from '../../repositories/auth.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoModule } from '../../crypto/crypto.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
@Module({
  imports: [
    CryptoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, LocalStrategy, SessionSerializer],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
