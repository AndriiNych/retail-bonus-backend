import { Controller, Get, Query } from '@nestjs/common';
import { DailyTasksService } from './daily-tasks.service';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks-query.base.dto';

@Controller('daily-tasks')
export class DailyTasksController {
  constructor(private readonly dailyTasksService: DailyTasksService) {}

  @Get('/recalc')
  async processDailyReculculateBonusByDate(
    @Query() dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ) {
    return await this.dailyTasksService.processDailyReculculateBonusByDate(dailyTasksQueryBaseDto);
  }
}
