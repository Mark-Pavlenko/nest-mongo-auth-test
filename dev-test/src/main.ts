import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  await app.listen(await config.getPortConfig());
  Logger.log(
    `🚀 Application is running on: http://localhost:${await config.getPortConfig()}`,
  );
}
bootstrap();
