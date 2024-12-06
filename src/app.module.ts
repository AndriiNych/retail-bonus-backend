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
import { RegisterBalansModule } from './entities/register-balans/register-balans.module';
import { RegisterSavingModule } from './entities/register-saving/register-saving.module';
import { DailyTasksModule } from './services/daily-tasks/daily-tasks.module';

@Module({
  imports: [
    ConfigModuleRoot.forRoot(),
    ConfigModule,
    TypeOrmModule,
    ActiveModule,
    CustomerModule,
    RegisterBalansModule,
    RegisterSavingModule,
    ReceiptModule,
    StoreModule,
    StoreSettingsModule,
    WorkerModule,
    DailyTasksModule,
  ],
})
export class AppModule {}
