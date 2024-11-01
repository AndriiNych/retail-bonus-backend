import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { startActivateOnrenderServer } from './utils/active.onrender';
import { ConfigService } from '@nestjs/config';
import { ApiKeyAuthGuard } from './auth/apiKeyGuard';

// startActivateOnrenderServer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Вмикає автоматичне перетворення
      },
      // stopAtFirstError: true,
    }),
  );

  app.useGlobalGuards(new ApiKeyAuthGuard(app.get(ConfigService)));

  await app.listen(process.env.PORT);
}
bootstrap();
