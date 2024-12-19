import { Controller, Get, Param, Query } from '@nestjs/common';
import { DailyTasksService } from './daily-tasks.service';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks.query.base.dto';
import { DailyTasksParamsDto } from './dto/dayly-tasks.params.dto';
import { DailyTasksPeriodQueryDto } from './dto/daiy-tasks-period.query.dtp';

@Controller('daily-tasks')
export class DailyTasksController {
  constructor(private readonly dailyTasksService: DailyTasksService) {}

  @Get('/recalc-period')
  async processDailyReculculateBonusByPeriod(
    @Query() dailyTasksPeriodQueryDto: DailyTasksPeriodQueryDto,
  ) {
    return await this.dailyTasksService.processDailyRecalculateBonusByPeriod(
      dailyTasksPeriodQueryDto,
    );
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
