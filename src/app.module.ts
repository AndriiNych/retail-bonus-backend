import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from './db/typeorm.module';

import { ActiveModule } from './entities/active/active.module';
import { CustomerModule } from './entities/customer/customer.module';
import { StoreModule } from './entities/store/store.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    ActiveModule,
    CustomerModule,
    StoreModule,
  ],
})
export class AppModule {}
