import { Injectable } from '@nestjs/common';
import { DailyTasksQueryDto } from './dto/daily-tasks-query.dto';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { DataSource, EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks-query.base.dto';
import { ActiveType } from '@src/entities/register-balans/utils/types';
import { CustomerResponseDto } from '@src/entities/customer/dto/customer-response.dto';
import { RegisterBalansDto } from '@src/entities/register-balans/dto/register-balans.dto';
import { MATH } from '@src/utils/math.decimal';
import { CustomerService } from '@src/entities/customer/customer.service';
import { FIELDS_LENGTH } from '@src/db/const-fields';

@Injectable()
export class DailyTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
    private readonly customerService: CustomerService,
  ) {}

  public async processDailyReculculateBonusByDate(
    dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ): Promise<CustomerResponseDto[]> {
    // RegisterBalansResponseDto[]>
    const { all } = dailyTasksQueryBaseDto;
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

      // const updatedCustomerIdList = new Set();
      const updatedCustomerIdList = new Set([...resultDisabled, ...resultActivated]);

      // if query-param "all" is true,
      // then recalculate to all customers by amountBonus
      // else recalculate customers by amountBonus where is implemented recalculate
      const customerListToRecalc = await this.prepareCustomersList(
        manager,
        updatedCustomerIdList,
        all,
      );

      //  recalculate bonuses
      const updatedCustomersList = await this.recalculateCustomersBonuses(
        manager,
        customerListToRecalc,
      );

      return updatedCustomersList;
    });

    return resultTransaction;
  }

  private async recalculateCustomersBonuses(
    manager: EntityManager,
    customers: Set<number>,
  ): Promise<CustomerResponseDto[]> {
    const result = await Promise.all(
      [...customers].map(customerId => this.recalculateCustomerBonusById(manager, customerId)),
    );

    return result;
  }

  private async recalculateCustomerBonusById(
    manager: EntityManager,
    customerId: number,
  ): Promise<CustomerResponseDto> {
    const registerBalansListByCustomerId = await this.registerBalansService.getAllRecords(manager, {
      customerId,
      activeType: ActiveType.Active,
    });

    const newBonus = this.recalculateCustomerBonus(registerBalansListByCustomerId);

    const updatedCustomer = await this.customerService.updateCustomerById(manager, {
      id: customerId,
      amountBonus: newBonus,
    });

    return updatedCustomer;
  }

  private recalculateCustomerBonus(registerBalansListForCustomer: RegisterBalansDto[]): string {
    const newBonus = registerBalansListForCustomer.reduce((acc, registerBalansRecord) => {
      const { bonus, usedBonus } = registerBalansRecord;
      return acc + parseFloat(MATH.DECIMAL.subtract(bonus, usedBonus));
    }, 0);

    return newBonus.toFixed(FIELDS_LENGTH.DECIMAL.SCALE);
  }

  private async prepareCustomersList(
    manager: EntityManager,
    customers: Set<number>,
    all: boolean,
  ): Promise<Set<number>> {
    if (all) {
      const listCustomerId = await this.registerBalansService.getListCustomerId(manager);

      return new Set([...listCustomerId]);
    }

    return new Set([...customers]);
  }

  private transfomQueryObjForRecalc(
    queryObj: DailyTasksQueryBaseDto,
  ): Record<string, DailyTasksQueryDto> {
    const { date } = queryObj;

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

    for (const e of registerBalansList) {
      const newRecord = { activeType };
      await this.registerBalansService.updateRegisterBalansById(manager, e.id, newRecord);
      result.add(e.customerId);
    }

    return result;
  }
}
