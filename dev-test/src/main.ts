import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import { ConfigService } from './config/config.service';
import * as session from 'express-session';
import * as passport from 'passport';
import {HttpExceptionFilter} from "./filters/HttpExceptionFilter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new ConfigService();
  await app.listen(await config.getPortConfig());
  Logger.log(
    `🚀 Application is running on: http://localhost:${await config.getPortConfig()}`,
  );
}
bootstrap();
