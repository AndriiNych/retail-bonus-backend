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
import { DATE } from '@src/utils/date';
import { RegisterBalansUpdateShortDto } from '@src/entities/register-balans/dto/register-balans.update.short.dto';

@Injectable()
export class DailyTasksService {
  private fetchRegisterBalansList: RegisterBalansDto[];
  private rbList: any[];

  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
    private readonly customerService: CustomerService,
  ) {
    this.fetchRegisterBalansList = [];
    this.rbList = [];
  }

  public async processDailyRecalculateCustomerByDate(
    dailyTasksParamsDto: DailyTasksParamsDto,
    dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ): Promise<Record<string, CustomerResponseDto[]>> {
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
  ): Promise<Record<string, CustomerResponseDto[]>> {
    await this.prepareListsRegisterBalansForCalculate(manager, queryObj);

    console.log(this.fetchRegisterBalansList);

    this.makeToRecalculateRegisterBalans();

    await this.updateAllChangesInRegisterBalans(manager);

    const updatedCustomer = await this.saveNewBalansToCustomer(manager, queryObj);

    return wrapperResponseEntity(updatedCustomer, CustomerResponseDto, TABLE_NAMES.customer);
  }

  private async saveNewBalansToCustomer(
    manager: EntityManager,
    queryObj: DailyTasksQueryDto,
  ): Promise<CustomerResponseDto> {
    const { customerId } = queryObj;
    const newAmountBonus = this.rbList
      .reduce((acc, { activeType, documentType, bonus, usedBonus }) => {
        let result: number = 0;
        if (
          activeType === ActiveType.Active &&
          [DocumentType.Receipt, DocumentType.AddBonus].includes(documentType)
        ) {
          result = bonus - usedBonus;
        }
        return acc + result;
      }, 0)
      .toFixed(FIELDS_LENGTH.DECIMAL.SCALE);

    return await this.customerService.updateCustomerById(manager, {
      id: customerId,
      amountBonus: newAmountBonus,
    });
  }

  private async updateAllChangesInRegisterBalans(manager: EntityManager) {
    // creating a list of changed records to update
    const listForUpdate = this.rbList
      .filter((item, idx) => {
        const { activeType, bonus, usedBonus } = this.fetchRegisterBalansList[idx];
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

    if (listForUpdate.length > 0) {
      const updateRegisterBalans = async (
        registerBalansUpdateShortDto: RegisterBalansUpdateShortDto,
      ): Promise<void> => {
        const { id, ...registryBalansUpdateDto } = registerBalansUpdateShortDto;
        await this.registerBalansService.updateRegisterBalansById(
          manager,
          id,
          registryBalansUpdateDto,
        );
      };

      await Promise.all(listForUpdate.map(updateRegisterBalans));
    }
  }

  private makeToRecalculateRegisterBalans() {
    for (let idxMain: number = 0; idxMain < this.rbList.length; idxMain++) {
      const { documentType, documentUuid, startDate } = this.rbList[idxMain];

      // close or activate record on current startDate
      for (let idx: number = 0; idx < idxMain; idx++) {
        const { activeType: activeTypeIdx, endDate: endDateIdx } = this.rbList[idx];

        if (activeTypeIdx === ActiveType.Active && endDateIdx <= startDate) {
          this.rbList[idx].activeType = ActiveType.Close;
        }
        /* this cannot be, because the records are sorted by startDate
        if (activeTypeIdx === ActiveType.Future && startDateIdx <= startDate) {
          rbList[idx].activeType = ActiveType.Active;
        }
        */
      }

      if (documentType === DocumentType.Receipt) {
        this.rbList[idxMain].activeType = ActiveType.Active;

        this.rbList
          .filter(
            ({ documentReturnUuid, documentType }) =>
              documentReturnUuid === documentUuid && documentType === DocumentType.ReceiptForReturn,
          )
          .forEach(({ bonus }) => {
            this.rbList[idxMain].usedBonus = this.rbList[idxMain].usedBonus + bonus;
          });
      }

      if (documentType === DocumentType.ReceiptForReturn) {
        this.rbList[idxMain].activeType = ActiveType.Close;
      }

      if (documentType === DocumentType.AddBonus) {
        this.rbList[idxMain].activeType = ActiveType.Active;
      }

      if ([DocumentType.SpentBonus, DocumentType.RemoveBonus].includes(documentType)) {
        this.rbList[idxMain].activeType = ActiveType.Close;
        let spentBonus = this.rbList[idxMain].bonus;

        for (let idx: number = 0; idx < idxMain; idx++) {
          const {
            activeType: activeTypeIdx,
            documentType: documentTypeIdx,
            bonus: bonusIdx,
            usedBonus: usedBonusIdx,
          } = this.rbList[idx];

          const subBonusIdx = MATH.DECIMAL.round(bonusIdx - usedBonusIdx);
          if (
            spentBonus > 0 &&
            activeTypeIdx === ActiveType.Active &&
            [DocumentType.Receipt, DocumentType.AddBonus].includes(documentTypeIdx) &&
            subBonusIdx > 0
          ) {
            if (subBonusIdx < spentBonus) {
              this.rbList[idx].usedBonus = bonusIdx;
              spentBonus = MATH.DECIMAL.round(spentBonus - subBonusIdx);
            } else if (subBonusIdx > spentBonus) {
              this.rbList[idx].usedBonus = MATH.DECIMAL.round(usedBonusIdx + spentBonus);
              spentBonus = 0;
            } else {
              this.rbList[idx].usedBonus = bonusIdx;
              spentBonus = 0;
            }
          }
        }
      }
    }
  }

  private async prepareListsRegisterBalansForCalculate(
    manager: EntityManager,
    queryObj: DailyTasksQueryDto,
  ): Promise<void> {
    const { customerId } = queryObj;
    const additionalObj = {
      addSort: `
      CASE 
      WHEN register_balans.document_type = ${DocumentType.Receipt} THEN 1 
      WHEN register_balans.document_type = ${DocumentType.AddBonus} THEN 2 
      WHEN register_balans.document_type = ${DocumentType.ReceiptForReturn} THEN 3 
      WHEN register_balans.document_type = ${DocumentType.RemoveBonus} THEN 4 
      WHEN register_balans.document_type = ${DocumentType.SpentBonus} THEN 5 
      ELSE 100 
      END `,
    };

    const registerBalansList = await this.registerBalansService.getAllRecords(
      manager,
      queryObj,
      additionalObj,
    );
    this.fetchRegisterBalansList = [...registerBalansList];

    this.rbList = registerBalansList.map(item => ({
      ...item,
      activeType: ActiveType.Future,
      bonus: parseFloat(item.bonus),
      usedBonus: 0,
      startDate: DATE.ONLY_DATE(item.startDate),
      endDate: DATE.ONLY_DATE(item.endDate),
    }));
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
