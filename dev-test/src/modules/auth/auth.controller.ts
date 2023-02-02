import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
// import LocalAuthenticationGuard from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private userService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newUser: any = await this.userService.registerUser(
        createUserDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newUser);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    console.log('req.user', req.user);
    return { User: req.user, msg: 'User logged in' };
  }
}
