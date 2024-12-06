import { Controller, Get, Query } from '@nestjs/common';
import { DailyTasksService } from './daily-tasks.service';
import { DailyTasksQueryDto } from './dto/daily-tasks-query.dto';

@Controller('daily-tasks')
export class DailyTasksController {
  constructor(private readonly dailyTasksService: DailyTasksService) {}

  @Get('/recalc')
  async processDailyReculculateBonusByDate(@Query() dailyTasksQueryDto: DailyTasksQueryDto) {
    return await this.dailyTasksService.processDailyReculculateBonusByDate(dailyTasksQueryDto);
  }
}
