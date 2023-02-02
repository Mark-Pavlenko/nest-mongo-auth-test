import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { changePasswordDto } from './dto/changePassword.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UserService } from './user.service';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { changePasswordSchema } from '../../types/changePassword';
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
    @Body(new ValidationPipe(changePasswordSchema))
    changePassword: changePasswordDto,
  ) {
    return await this.userService.changePassword(req.user, changePassword);
  }
}
