import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  app.use(
    session({
      secret: await config.getSessionSecret(),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(await config.getPortConfig());
  Logger.log(
    `🚀 Application is running on: http://localhost:${await config.getPortConfig()}`,
  );
}
bootstrap();
