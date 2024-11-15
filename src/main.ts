import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { startActivateOnrenderServer } from './utils/active.onrender';
import { ConfigService } from '@nestjs/config';
import { ApiKeyAuthGuard } from './auth/apiKeyGuard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

startActivateOnrenderServer();

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

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalGuards(new ApiKeyAuthGuard(app.get(ConfigService)));

  await app.listen(process.env.PORT);
}
bootstrap();
