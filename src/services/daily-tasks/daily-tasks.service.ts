import { Injectable } from '@nestjs/common';
import { DailyTasksQueryDto } from './dto/daily-tasks.query.dto';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { DataSource, EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks.query.base.dto';
import { ActiveType, DocumentType } from '@src/entities/register-balans/utils/types';
import { CustomerResponseDto } from '@src/entities/customer/dto/customer-response.dto';
import { RegisterBalansDto } from '@src/entities/register-balans/dto/register-balans.dto';
import { MATH } from '@src/utils/math.decimal';
import { CustomerService } from '@src/entities/customer/customer.service';
import { FIELDS_LENGTH } from '@src/db/const-fields';
import { wrapperResponseEntity } from '@src/utils/response-wrapper/wrapper-response-entity';
import { TABLE_NAMES } from '@src/db/const-tables';
import { DailyTasksParamsDto } from './dto/dayly-tasks.params.dto';
import { CustomerDto } from '@src/entities/customer/dto/customer.dto';

@Injectable()
export class DailyTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
    private readonly customerService: CustomerService,
  ) {}

  public async processDailyRecalculateCustomerByDate(
    dailyTasksParamsDto: DailyTasksParamsDto,
    dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ): Promise<CustomerDto> {
    const { customerId } = dailyTasksParamsDto;
    const { date } = dailyTasksQueryBaseDto;

    const updatedCustomer = await this.dataSource.transaction(async manager => {
      const queryOnActivated = plainToInstance(DailyTasksQueryDto, {
        startDate: { lte: date },
        customerId,
        sort: { startDate: 'ASC', endDate: 'ASC' },
      });

      return await this.recalculateCustomerBonusHistory(manager, queryOnActivated);
    });

    return updatedCustomer;
  }

  private async recalculateCustomerBonusHistory(
    manager: EntityManager,
    queryObj: DailyTasksQueryDto,
  ): Promise<CustomerDto> {
    const registerBalansList = await this.registerBalansService.getAllRecords(manager, queryObj);

    const rbList = registerBalansList.map(item => ({
      ...item,
      activeType: ActiveType.Future,
      bonus: parseFloat(item.bonus),
      usedBonus: parseFloat(item.usedBonus),
      startDate: new Date(
        item.startDate.getFullYear(),
        item.startDate.getMonth(),
        item.startDate.getDate(),
      ),
      endDate: new Date(
        item.endDate.getFullYear(),
        item.endDate.getMonth(),
        item.endDate.getDate(),
      ),
    }));

    for (let idxMain: number = 0; idxMain < rbList.length; idxMain++) {
      const {
        activeType,
        documentType,
        documentUuid,
        documentReturnUuid,
        bonus,
        usedBonus,
        startDate,
        endDate,
      } = rbList[idxMain];

      // close or activate record on current startDate
      for (let idx: number = 0; idx < idxMain; idx++) {
        const {
          activeType: activeTypeIdx,
          // documentType:documentTypeIdx ,
          // documentUuid: documentUuidIdx,
          // documentReturnUuid: documentReturnUuidIdx,
          // bonus: bonusIdx,
          // usedBonus: usedBonusIdx,
          // startDate: startDateIdx,
          endDate: endDateIdx,
        } = rbList[idx];
        /* this cannot be, because the records are sorted by startDate
        if (activeTypeIdx === ActiveType.Future && startDateIdx <= startDate) {
          rbList[idx].activeType = ActiveType.Active;
        }
        */
        if (activeTypeIdx === ActiveType.Active && endDateIdx <= startDate) {
          rbList[idx].activeType = ActiveType.Close;
        }
      }

      if (documentType === DocumentType.Receipt) {
        //TODO implement
      }

      /*
      // not do anything, because it is enough to change the activeType
      if (documentType === DocumentType.ReceiptForReturn) { }
      if (documentType === DocumentType.AddBonus) { }
      */

      if ([DocumentType.SpentBonus, DocumentType.RemoveBonus].includes(documentType)) {
        rbList[idxMain].activeType = ActiveType.Close;
        let spentBonus = rbList[idxMain].bonus;

        for (let idx: number = 0; idx < idxMain; idx++) {
          const {
            activeType: activeTypeIdx,
            documentType: documentTypeIdx,
            bonus: bonusIdx,
            usedBonus: usedBonusIdx,
          } = rbList[idx];

          const subBonusIdx = MATH.DECIMAL.round(bonusIdx - usedBonusIdx);
          if (
            spentBonus > 0 &&
            activeTypeIdx !== ActiveType.Active &&
            [DocumentType.Receipt, DocumentType.AddBonus].includes(documentTypeIdx) &&
            subBonusIdx > 0
          ) {
            if (subBonusIdx < spentBonus) {
              rbList[idx].usedBonus = bonusIdx;
              spentBonus = spentBonus - subBonusIdx;
            } else if (subBonusIdx > spentBonus) {
              rbList[idx].usedBonus = usedBonusIdx + spentBonus;
              spentBonus = 0;
            } else {
              rbList[idx].usedBonus = bonusIdx;
              spentBonus = 0;
            }
          }
        }
      }
    }

    // let newAmountBonus: number = 0;

    // const newBonus =

    return await this.customerService.getCustomerById(queryObj.customerId);
  }

  public async processDailyReculculateBonusByDate(
    dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ): Promise<Record<string, CustomerResponseDto[]>> {
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

    return wrapperResponseEntity(resultTransaction, CustomerResponseDto, TABLE_NAMES.customer);
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
