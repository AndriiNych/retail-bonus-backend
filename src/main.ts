import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

// import { startActivateOnrenderServer } from './utils/active.onrender';
import { ConfigService } from '@nestjs/config';
import { ApiKeyAuthGuard } from './auth/apiKeyGuard';

//TODO make send request with authorization
// startActivateOnrenderServer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalGuards(new ApiKeyAuthGuard(app.get(ConfigService)));

  await app.listen(process.env.PORT);
}
bootstrap();
