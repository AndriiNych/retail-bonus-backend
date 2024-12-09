import { Module } from '@nestjs/common';
import { DailyTasksController } from './daily-tasks.controller';
import { DailyTasksService } from './daily-tasks.service';

@Module({
  imports: [],
  controllers: [DailyTasksController],
  providers: [DailyTasksService],
})
export class DailyTasksModule {}
