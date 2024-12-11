import { Injectable, NotImplementedException, UnprocessableEntityException } from '@nestjs/common';
import { DailyTasksQueryDto } from './dto/daily-tasks-query.dto';
import { getQueryParamValueAsBoolean } from '@src/utils/function.boolean';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { RegisterBalansQueryDto } from '@src/entities/register-balans/dto/register-balsns.query.dto';
import { RegisterBalansResponseDto } from '@src/entities/register-balans/dto/register-balans-response.dto';
import { RegisterBalans } from '@src/entities/register-balans/register-balans.entity';
import { TABLE_NAMES } from '@src/db/const-tables';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  addConditionToQueryBuilder,
  addSortToQueryBuilder,
  configureSelectQueryBuilder,
} from '@src/utils/repository/add-select-query_builder';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks-query.base.dto';
import { ActiveType } from '@src/entities/register-balans/utils/types';

@Injectable()
export class DailyTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
  ) {}

  public async processDailyReculculateBonusByDate(
    dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ): Promise<void> {
    // RegisterBalansResponseDto[]>
    const { queryOnDisabled, queryOnActivated } =
      this.transfomQueryObjForRecalc(dailyTasksQueryBaseDto);

    const resultTransaction = await this.dataSource.transaction(async manager => {
      // disable rows in register-balance with data-end <= calculateDate
      const resultDisabled = await this.updateDataInRegisterBalasn(
        manager,
        queryOnDisabled,
        ActiveType.Close,
      );

      // activate rows in register-balance where data-start <= calculateDate
      const resultActivated = await this.updateDataInRegisterBalasn(
        manager,
        queryOnActivated,
        ActiveType.Active,
      );

      //TODO review TypeDocument !!!

      // const updatedCustomerIdList = new Set();
      const updatedCustomerIdList = new Set([...resultDisabled, ...resultActivated]);
      return updatedCustomerIdList;
    });

    console.log(resultTransaction);

    // return plainToInstance(RegisterBalansResponseDto, resultTransaction);
    // console.log(updatedCustomerIdList);

    // if query-param "all" is true,
    // then recalculate to all customers by amountBonus
    // else recalculate customers by amountBonus where is implemented recalculate
  }

  private transfomQueryObjForRecalc(
    queryObj: DailyTasksQueryBaseDto,
  ): Record<string, DailyTasksQueryDto> {
    const { date, customerId, all } = queryObj;

    const queryOnDisabled = plainToInstance(DailyTasksQueryDto, {
      endDate: { lte: date },
      activeType: ActiveType.Active,
    });

    const queryOnActivated = plainToInstance(DailyTasksQueryDto, {
      startDate: { lte: date },
      activeType: ActiveType.Future,
    });

    return { queryOnDisabled, queryOnActivated };
  }

  private async updateDataInRegisterBalasn(
    manager: EntityManager,
    queryByUpdate: DailyTasksQueryDto,
    activeType: ActiveType,
  ): Promise<Set<number>> {
    const result: Set<number> = new Set();

    const registerBalansList = await this.registerBalansService.getAllRecords(
      manager,
      queryByUpdate,
    );
    console.log(queryByUpdate);
    console.log({ ...registerBalansList });

    for (const e of registerBalansList) {
      const newRecord = { activeType };
      await this.registerBalansService.updateRegisterBalansById(manager, e.id, newRecord);
      result.add(e.customerId);
    }

    return result;
  }
}
