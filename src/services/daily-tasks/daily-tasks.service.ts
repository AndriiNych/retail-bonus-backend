import { Injectable } from '@nestjs/common';
import { DailyTasksQueryDto } from './dto/daily-tasks-query.dto';
import { getQueryParamValueAsBoolean } from '@src/utils/function.boolean';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { DataSource, EntityManager } from 'typeorm';
import { RegisterBalansQueryDto } from '@src/entities/register-balans/dto/register-balsns.query.dto';
import { RegisterBalansResponseDto } from '@src/entities/register-balans/dto/register-balans-response.dto';

@Injectable()
export class DailyTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
  ) {}

  public async processDailyReculculateBonusByDate(dailyTasksQueryDto: DailyTasksQueryDto) {
    // const { date: qCalculateDate, all } = dailyTasksQueryDto;
    // const qAll = getQueryParamValueAsBoolean(all);
    console.log(dailyTasksQueryDto);

    let updatedCustomerIdList: Set<number>;

    const resultTransaction = await this.dataSource.transaction(async manager => {
      // disable rows in register-balance with data-end <= calculateDate
      // const resultDisable = await this.disableRecordWithDataEndIsExpired(
      //   manager,
      //   dailyTasksQueryDto,
      // );
      // // activate rows in register-balance where data-start <= calculateDate

      // updatedCustomerIdList = new Set([...resultTransaction]);
      return {};
    });

    console.log(updatedCustomerIdList);

    // if query-param "all" is true,
    // then recalculate to all customers by amountBonus
    // else recalculate customers by amountBonus where is implemented recalculate

    // const contractors = await manager
    // .createQueryBuilder(Contractor, 'contractor')
    // .where('contractor.name LIKE :name', { name: searchString }) // Пошук за назвою
    // .andWhere('contractor.createdAt > :date', { date: '2022-12-12' }) // Фільтр за датою створення
    // .orderBy('contractor.name', 'ASC') // Сортування за назвою
    // .addOrderBy('contractor.createdAt', 'DESC') // Сортування за датою створення
    // .skip((page - 1) * pageSize) // Пропустити записи для попередніх сторінок
    // .take(pageSize) // Обмежити кількість записів
    // .getMany(); // Отримати масив записів
  }

  /*
  private async disableRecordWithDataEndIsExpired(
    manager: EntityManager,
    query: RegisterBalansQueryDto,
  ): Promise<Set<number>> {
    const result: Set<number> = new Set();

    const registerBalansList = await this.registerBalansService.getAllRecordsByDate(manager, query);

    console.log(registerBalansList);

    for (const e of registerBalansList) {
      const newRecord = { activeType: 99 };
      await this.registerBalansService.updateRegisterBalansById(manager, e.id, newRecord);
      result.add(e.customerId);
    }

    return result;
  }
*/

  /*
  private async getAllRecordsWithDataEndByDate(
    manager: EntityManager,
    query: RegisterBalansQueryDto,
  ): Promise<RegisterBalansResponseDto[]> {
    const { startDate = '2024-01-01', endDate = new Date() } = query;

    console.log(startDate);
    console.log(endDate);

    const result = await manager
      .createQueryBuilder(RegisterBalans, TABLE_NAMES.register_balans)
      .where('register_balans.end_date >= :startDate', { startDate })
      .andWhere('register_balans.end_date <= :endDate', { endDate })
      .andWhere('register_balans.active_type = :activeType', { activeType: 1 })
      .getMany();

    return result;
  }
*/
}
