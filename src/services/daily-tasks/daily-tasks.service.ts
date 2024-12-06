import { Injectable } from '@nestjs/common';
import { DailyTasksQueryDto } from './dto/daily-tasks-query.dto';

@Injectable()
export class DailyTasksService {
  constructor() {}

  public async processDailyReculculateBonusByDate(dailyTasksQueryDto: DailyTasksQueryDto) {
    const { date: calculateDate } = dailyTasksQueryDto;

    // disable rows in register-balance with data-end <= calculateDate

    // activate rows in register-balance where data-start <= calculateDate

    // if query-param "all" is true,
    // then recalculate to all customers by amountBonus
    // else recalculate customers by amountBonus where is implemented recalculate
  }
}
