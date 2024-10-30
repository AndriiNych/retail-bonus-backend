import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { ConfigModule as ConfigModuleRoot } from '@nestjs/config';
import { TypeOrmModule } from './db/typeorm.module';

import { ActiveModule } from './entities/active/active.module';
import { CustomerModule } from './entities/customer/customer.module';
import { StoreModule } from './entities/store/store.module';
import { StoreSettingsModule } from './entities/store-settings/storeSettings.module';
// import { ApiKeyGuard } from './auth/apiKeyGuard';
import { APP_GUARD } from '@nestjs/core';

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
  // providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
