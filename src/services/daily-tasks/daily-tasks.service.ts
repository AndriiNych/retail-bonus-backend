import { Injectable, NotImplementedException, UnprocessableEntityException } from '@nestjs/common';
import { DailyTasksQueryDto } from './dto/daily-tasks-query.dto';
import { getQueryParamValueAsBoolean } from '@src/utils/function.boolean';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { RegisterBalansQueryDto } from '@src/entities/register-balans/dto/register-balsns.query.dto';
import { RegisterBalansResponseDto } from '@src/entities/register-balans/dto/register-balans-response.dto';
import { RegisterBalans } from '@src/entities/register-balans/register-balans.entity';
import { TABLE_NAMES } from '@src/db/const-tables';
import { plainToInstance } from 'class-transformer';

const transformQueryKeyToSymbol = {
  ne: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
};

@Injectable()
export class DailyTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
  ) {}

  public async processDailyReculculateBonusByDate(
    dailyTasksQueryDto: DailyTasksQueryDto,
  ): Promise<RegisterBalansResponseDto[]> {
    // const { date: qCalculateDate, all } = dailyTasksQueryDto;
    // const qAll = getQueryParamValueAsBoolean(all);
    console.log(dailyTasksQueryDto);

    let updatedCustomerIdList: Set<number>;

    const resultTransaction = await this.dataSource.transaction(async manager => {
      const r = await this.getSelectRecords(manager, dailyTasksQueryDto);
      console.log(r);
      // try {
      //   const sqb = manager.createQueryBuilder(RegisterBalans, TABLE_NAMES.register_balans);

      //   const sqbWere = this.addConditionToQueryBuilder(sqb, dailyTasksQueryDto);

      //   result = await sqbWere.getMany();

      //   // disable rows in register-balance with data-end <= calculateDate
      //   // const resultDisable = await this.disableRecordWithDataEndIsExpired(
      //   //   manager,
      //   //   dailyTasksQueryDto,
      //   // );
      // } catch (err) {
      //   throw new UnprocessableEntityException(err);
      // }

      // // activate rows in register-balance where data-start <= calculateDate

      // updatedCustomerIdList = new Set([...resultTransaction]);
      return r;
    });

    return plainToInstance(RegisterBalansResponseDto, resultTransaction);
    // console.log(updatedCustomerIdList);

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

  private async getSelectRecords(
    manager: EntityManager,
    queryString: DailyTasksQueryDto,
  ): Promise<RegisterBalansResponseDto[]> {
    const sqb = manager.createQueryBuilder(RegisterBalans, TABLE_NAMES.register_balans);

    const sqbWere = this.addConditionToQueryBuilder(sqb, queryString);

    try {
      return await sqbWere.getMany();
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  private addConditionToQueryBuilder<T>(
    sqb: SelectQueryBuilder<T>,
    condition,
  ): SelectQueryBuilder<T> {
    Object.entries(condition).forEach(([key, value]) => {
      if (typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Date]') {
        Object.entries(value).forEach(([keyIn, valueIn]) => {
          if (
            typeof valueIn === 'object' &&
            Object.prototype.toString.call(valueIn) !== '[object Date]'
          ) {
            throw new NotImplementedException(`Not Implemented. ${keyIn} is error.`);
          }
          console.log(
            `${this.getColumnNameInEntity(sqb, key)} ${transformQueryKeyToSymbol[keyIn]} :${keyIn}`,
            {
              [keyIn]: valueIn,
            },
          );
          sqb.andWhere(
            `${this.getColumnNameInEntity(sqb, key)} ${transformQueryKeyToSymbol[keyIn]} :${keyIn}`,
            {
              [keyIn]: valueIn,
            },
          );
        });
      } else {
        console.log(`${this.getColumnNameInEntity(sqb, key)} = :${key}`, { [key]: value });
        sqb.andWhere(`${this.getColumnNameInEntity(sqb, key)} = :${key}`, { [key]: value });
      }
    });
    return sqb;
  }

  private getColumnNameInEntity<T>(
    sqb: SelectQueryBuilder<T>,
    propertyName: string,
  ): string | undefined {
    const metadata = sqb.connection.getMetadata(sqb.alias);

    const column = metadata.columns.find(col => col.propertyName === propertyName);

    return column?.databaseName;
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
