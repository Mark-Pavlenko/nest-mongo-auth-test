import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { registerUserSchema } from '../../types/registerUser';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(
    @Body(new ValidationPipe(registerUserSchema))
    createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newUser: CreateUserDto = await this.authService.registerUser(
        createUserDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send({
        requestObject: {
          user: newUser,
        },
        message: 'User was successfully created!',
      });
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await session.endSession();
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    return {
      requestObject: {
        username: req.user.username,
      },
      message: 'Successfully logged in!',
    };
  }
}
