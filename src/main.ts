import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { activeOnrenderServer } from './utils/active.onrender';

setInterval(() => {
  console.log(`datetime: ${new Date()}`);
  activeOnrenderServer();
}, Number(process.env.ACTIVE_DELAY));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT);
}
bootstrap();
