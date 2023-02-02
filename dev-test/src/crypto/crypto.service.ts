import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptoService {
  readonly salt: number = 12;

  async hash(input: string): Promise<string> {
    return await hash(input, this.salt);
  }

  async comparePasswords(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(rawPassword, hashedPassword);
  }
}
