import { Module } from '@nestjs/common';
import { DailyTasksController } from './daily-tasks.controller';
import { DailyTasksService } from './daily-tasks.service';
import { RegisterBalansModule } from '@src/entities/register-balans/register-balans.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '@src/entities/customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature(), RegisterBalansModule, CustomerModule],
  controllers: [DailyTasksController],
  providers: [DailyTasksService],
})
export class DailyTasksModule {}
