import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from './db/typeorm.module';

@Module({
  imports: [ConfigModule, TypeOrmModule],
})
export class AppModule {}
