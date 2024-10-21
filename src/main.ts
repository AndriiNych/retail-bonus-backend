import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startActivateOnrenderServer } from './utils/active.onrender';

startActivateOnrenderServer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT);
}
bootstrap();
