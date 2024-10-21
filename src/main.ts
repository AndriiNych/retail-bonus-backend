import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { startActivateOnrenderServer } from './utils/active.onrender';

startActivateOnrenderServer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      // stopAtFirstError: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
