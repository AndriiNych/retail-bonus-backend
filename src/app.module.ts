import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from './db/typeorm.module';

import { CustomerModule } from './entities/customer/customer.module';

@Module({
  imports: [ConfigModule, TypeOrmModule, CustomerModule],
})
export class AppModule {}
