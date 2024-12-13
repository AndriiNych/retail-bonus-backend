import { Controller, Get, Param, Query } from '@nestjs/common';
import { DailyTasksService } from './daily-tasks.service';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks.query.base.dto';
import { DailyTasksParamsDto } from './dto/dayly-tasks.params.dto';

@Controller('daily-tasks')
export class DailyTasksController {
  constructor(private readonly dailyTasksService: DailyTasksService) {}

  @Get('/recalc')
  async processDailyReculculateBonusByDate(
    @Query() dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ) {
    return await this.dailyTasksService.processDailyReculculateBonusByDate(dailyTasksQueryBaseDto);
  }

  @Get('/recalc-customer/:customerId')
  async processDailyRecalculateCustomerByDate(
    @Param() dailyTasksParamsDto: DailyTasksParamsDto,
    @Query() dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ) {
    return await this.dailyTasksService.processDailyRecalculateCustomerByDate(
      dailyTasksParamsDto,
      dailyTasksQueryBaseDto,
    );
  }
}
