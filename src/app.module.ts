import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { ConfigModule as ConfigModuleRoot } from '@nestjs/config';
import { TypeOrmModule } from './db/typeorm.module';

import { ActiveModule } from './entities/active/active.module';
import { CustomerModule } from './entities/customer/customer.module';
import { StoreModule } from './entities/store/store.module';
import { StoreSettingsModule } from './entities/store-settings/store-settings.module';

@Module({
  imports: [
    ConfigModuleRoot.forRoot(),
    ConfigModule,
    TypeOrmModule,
    ActiveModule,
    CustomerModule,
    StoreModule,
    StoreSettingsModule,
  ],
})
export class AppModule {}
