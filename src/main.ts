import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

setInterval(() => {
  console.log(`datetime: ${new Date()}`);
}, 300000);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
