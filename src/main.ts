import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { activationOnrenderServer } from './temp/activation.onrender';

setInterval(() => {
  console.log(`datetime: ${new Date()}`);
  activationOnrenderServer();
}, 300000);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
