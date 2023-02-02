import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { changePasswordDto } from './dto/changePassword.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private userService: UserService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Post('/change-password')
  async changePassword(
    @Request() req,
    @Body() changePassword: changePasswordDto,
  ) {
    return await this.userService.changePassword(req.user, changePassword);
  }
}
