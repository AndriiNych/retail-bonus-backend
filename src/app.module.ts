import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { ConfigModule as ConfigModuleRoot } from '@nestjs/config';
import { TypeOrmModule } from './db/typeorm.module';

import { ActiveModule } from './entities/active/active.module';
import { CustomerModule } from './entities/customer/customer.module';
import { StoreModule } from './entities/store/store.module';
import { StoreSettingsModule } from './entities/store-settings/store-settings.module';
import { WorkerModule } from './entities/worker/worker.module';
import { ReceiptModule } from './entities/receipt/receipt.module';
import { ReceiptProgressModule } from './entities/receipt-progress/receipt-progress.module';

@Module({
  imports: [
    ConfigModuleRoot.forRoot(),
    ConfigModule,
    TypeOrmModule,
    ActiveModule,
    CustomerModule,
    ReceiptModule,
    ReceiptProgressModule,
    StoreModule,
    StoreSettingsModule,
    WorkerModule,
  ],
})
export class AppModule {}
