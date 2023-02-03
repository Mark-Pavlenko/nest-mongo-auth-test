import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from '@nestjs/class-validator';

export class CreateUserDto {

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
