import { Module } from '@nestjs/common';
import { DailyTasksController } from './daily-tasks.controller';
import { DailyTasksService } from './daily-tasks.service';
import { RegisterBalansModule } from '@src/entities/register-balans/register-balans.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '@src/entities/customer/customer.module';
import { RegisterSavingModule } from '@src/entities/register-saving/register-saving.module';
import { RecalculateCustomer } from './service/recalculate.customer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature(), RegisterBalansModule, RegisterSavingModule, CustomerModule],
  controllers: [DailyTasksController],
  providers: [DailyTasksService, RecalculateCustomer],
  exports: [DailyTasksService, RecalculateCustomer],
})
export class DailyTasksModule {}
