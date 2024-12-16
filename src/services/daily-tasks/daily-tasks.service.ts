import { ConsoleLogger, Injectable } from '@nestjs/common';
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
import { DATE } from '@src/utils/date';
import { RegisterBalansUpdateShortDto } from '@src/entities/register-balans/dto/register-balans.update.short.dto';

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
    const { customerId } = queryObj;
    const registerBalansList = await this.registerBalansService.getAllRecords(manager, queryObj);

    const rbList = registerBalansList.map(item => ({
      ...item,
      activeType: ActiveType.Future,
      bonus: parseFloat(item.bonus),
      usedBonus: 0,
      startDate: DATE.ONLY_DATE(item.startDate),
      endDate: DATE.ONLY_DATE(item.endDate),
    }));

    // console.log(rbList);

    for (let idxMain: number = 0; idxMain < rbList.length; idxMain++) {
      // if (idxMain > 2) break;
      const { documentType, documentUuid, startDate } = rbList[idxMain];
      // console.log(documentType);

      // do not process records that are ‘from the future’
      if (startDate > DATE.ONLY_DATE(new Date())) {
        continue;
      }

      // close or activate record on current startDate
      for (let idx: number = 0; idx < idxMain; idx++) {
        const { activeType: activeTypeIdx, endDate: endDateIdx } = rbList[idx];

        if (activeTypeIdx === ActiveType.Active && endDateIdx <= startDate) {
          rbList[idx].activeType = ActiveType.Close;
        }
        /* this cannot be, because the records are sorted by startDate
        if (activeTypeIdx === ActiveType.Future && startDateIdx <= startDate) {
          rbList[idx].activeType = ActiveType.Active;
        }
        */
      }

      if (documentType === DocumentType.Receipt) {
        rbList[idxMain].activeType = ActiveType.Active;
        // for (let idx = 0; idx < rbList.length; idx++) {
        //   const { documentReturnUuid: documentReturnUuidIdx, usedBonus: usedBonusIdx } =
        //     rbList[idx];
        //   if (documentUuid === documentReturnUuidIdx) {
        //     rbList[idxMain].usedBonus = rbList[idxMain].usedBonus + usedBonusIdx;
        //   }
        // }
      }

      /*
      // not do anything, because it is enough to change the activeType
      if (documentType === DocumentType.ReceiptForReturn) { }
      if (documentType === DocumentType.AddBonus) { }
      */

      if ([DocumentType.SpentBonus, DocumentType.RemoveBonus].includes(documentType)) {
        console.log('DocumentType.SpentBonus');
        rbList[idxMain].activeType = ActiveType.Close;
        let spentBonus = rbList[idxMain].bonus;
        // console.log(`spentBonus: ${spentBonus}, idx: ${idxMain}`);

        for (let idx: number = 0; idx < idxMain; idx++) {
          const {
            activeType: activeTypeIdx,
            documentType: documentTypeIdx,
            bonus: bonusIdx,
            usedBonus: usedBonusIdx,
          } = rbList[idx];

          const subBonusIdx = MATH.DECIMAL.round(bonusIdx - usedBonusIdx);
          console.log(
            `idx: ${idx}, activeTypeIdx: ${activeTypeIdx}, documentTypeIdx: ${documentTypeIdx}, subBonusIdx: ${subBonusIdx}`,
          );
          if (
            spentBonus > 0 &&
            activeTypeIdx === ActiveType.Active &&
            [DocumentType.Receipt, DocumentType.AddBonus].includes(documentTypeIdx) &&
            subBonusIdx > 0
          ) {
            if (subBonusIdx < spentBonus) {
              rbList[idx].usedBonus = bonusIdx;
              spentBonus = MATH.DECIMAL.round(spentBonus - subBonusIdx);
              console.log(
                `1! spentBonus: ${spentBonus}, subBonus: ${subBonusIdx}, usedBonus: ${rbList[idx].usedBonus}`,
              );
            } else if (subBonusIdx > spentBonus) {
              rbList[idx].usedBonus = MATH.DECIMAL.round(usedBonusIdx + spentBonus);
              spentBonus = 0;
              console.log(
                `2! spentBonus: ${spentBonus}, subBonus: ${subBonusIdx}, usedBonus: ${rbList[idx].usedBonus}`,
              );
            } else {
              rbList[idx].usedBonus = bonusIdx;
              spentBonus = 0;
              console.log(
                `3! spentBonus: ${spentBonus}, subBonus: ${subBonusIdx}, usedBonus: ${rbList[idx].usedBonus}`,
              );
            }
          }
        }
      }
    }
    // console.log('recalculating data');
    // console.log(rbList);

    // update changes in register_balans
    const listForUpdate = rbList
      .filter((item, idx) => {
        const { activeType, bonus, usedBonus } = registerBalansList[idx];
        return (
          item.activeType !== activeType ||
          item.bonus !== parseFloat(bonus) ||
          item.usedBonus !== parseFloat(usedBonus)
        );
      })
      .map(({ id, activeType, bonus, usedBonus }) => ({
        id,
        activeType,
        bonus: bonus.toFixed(FIELDS_LENGTH.DECIMAL.SCALE),
        usedBonus: usedBonus.toFixed(FIELDS_LENGTH.DECIMAL.SCALE),
      }));

    // console.log(`listForUpdate.length: ${listForUpdate.length}`);
    if (listForUpdate.length > 0) {
      const updateRegisterBalans = async (
        manager: EntityManager,
        registerBalansUpdateShortDto: RegisterBalansUpdateShortDto,
      ): Promise<void> => {
        const { id, ...registryBalansUpdateDto } = registerBalansUpdateShortDto;
        await this.registerBalansService.updateRegisterBalansById(
          manager,
          id,
          registryBalansUpdateDto,
        );
      };

      await Promise.all([...listForUpdate].map(item => updateRegisterBalans(manager, item)));
    }

    // update changes in customer
    let updatedCustomer: CustomerResponseDto;
    if (rbList.length > 0) {
      const newAmountBonus = rbList.reduce(
        (acc, item) =>
          acc + item.activeType === ActiveType.Active ? item.bonus - item.usedBonus : 0,
        0,
      );
      updatedCustomer = await this.customerService.updateCustomerById(manager, {
        id: customerId,
        amountBonus: newAmountBonus.toFixed(FIELDS_LENGTH.DECIMAL.SCALE),
      });
    }

    return updatedCustomer;
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
