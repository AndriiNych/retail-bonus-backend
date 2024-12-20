import { CustomerService } from '@src/entities/customer/customer.service';
import { RegisterBalansResponseDto } from '@src/entities/register-balans/dto/register-balans.response.dto';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { RegisterSavingService } from '@src/entities/register-saving/register-saving.service';
import { EntityManager } from 'typeorm';
import { CustomerResponseDto } from '@src/entities/customer/dto/customer.response.dto';
import { SelectQueryBuilderBaseDto } from '@src/utils/filters-query-dto/dto/select-query-builder.base.dto';
import { plainToInstance } from 'class-transformer';
import { DATE } from '@src/utils/date';
import { ActiveType, DocumentType } from '@src/entities/register-balans/utils/types';
import { FIELDS_LENGTH } from '@src/db/const-fields';
import { MATH } from '@src/utils/math.decimal';
import { RegisterBalansUpdateShortDto } from '@src/entities/register-balans/dto/register-balans.update.short.dto';
import { Injectable } from '@nestjs/common';
import { RegisterBalansResponseDigitalDto } from '@src/entities/register-balans/dto/register-balans.response.digital.dto';
import { RegisterSavingResponseDigitalDto } from '@src/entities/register-saving/dto/register-saving.response.digital.dto';

@Injectable()
export class RecalculateCustomer {
  private fetchRegisterBalansList: RegisterBalansResponseDto[];
  private rbList: RegisterBalansResponseDigitalDto[];
  private fetchRegisterSavingList: RegisterSavingResponseDigitalDto[];

  private manager: EntityManager;
  private customerId: number;
  private recalcDate: Date;

  constructor(
    private readonly registerBalansService: RegisterBalansService,
    private readonly registerSavingService: RegisterSavingService,
    private readonly customerService: CustomerService,
  ) {
    this.fetchRegisterBalansList = [];
    this.rbList = [];
    this.fetchRegisterSavingList = [];
  }

  public setParams(manager: EntityManager, customerId: number, recalcDate: Date) {
    this.manager = manager;
    this.customerId = customerId;
    this.recalcDate = recalcDate;
  }

  public async processDailyRecalculateCustomerByDateIntoTransaction(): Promise<CustomerResponseDto> {
    const queryOnActivatedForBalans = this.createSelectQueryBuilderObjForRegisterBalans();
    let changedCustomer = await this.recalculateCustomerBonusHistory(queryOnActivatedForBalans);

    const queryOnActivatedForSaving = this.createSelectQueryBuilderObjForRegisterSaving();
    changedCustomer = await this.recalculateCustomerSavingHistory(queryOnActivatedForSaving);

    return changedCustomer;
  }

  private async recalculateCustomerSavingHistory(
    queryObj: SelectQueryBuilderBaseDto,
  ): Promise<CustomerResponseDto> {
    await this.prepareListRegisterSavingForCalculate(queryObj);

    const newSaving = this.getRecalculationRegisterSavingForCustomer();

    const changedCustomer = await this.customerService.updateCustomerById(this.manager, {
      id: this.customerId,
      amountBox: newSaving.toFixed(FIELDS_LENGTH.DECIMAL.SCALE),
    });

    return changedCustomer;
  }

  private getRecalculationRegisterSavingForCustomer(): number {
    return this.fetchRegisterSavingList.reduce(
      (acc, { amount }) => MATH.DECIMAL.round(acc + amount),
      0,
    );
  }

  private async prepareListRegisterSavingForCalculate(
    queryObj: SelectQueryBuilderBaseDto,
  ): Promise<void> {
    const registerSavingList = await this.registerSavingService.getAllRecords(
      this.manager,
      queryObj,
    );
    this.fetchRegisterSavingList = registerSavingList.map(item => ({
      ...item,
      amount: parseFloat(item.amount),
    }));
  }

  private createSelectQueryBuilderObjForRegisterBalans(): SelectQueryBuilderBaseDto {
    return plainToInstance(SelectQueryBuilderBaseDto, {
      conditions: {
        startDate: { lte: DATE.END_DATE(this.recalcDate) },
        customerId: this.customerId,
      },
      orderBy: { startDate: 'ASC', endDate: 'ASC' },
      addOrderBy: `CASE 
              WHEN register_balans.document_type = ${DocumentType.Receipt} THEN 1 
              WHEN register_balans.document_type = ${DocumentType.AddBonus} THEN 2 
              WHEN register_balans.document_type = ${DocumentType.ReceiptForReturn} THEN 3 
              WHEN register_balans.document_type = ${DocumentType.RemoveBonus} THEN 4 
              WHEN register_balans.document_type = ${DocumentType.SpentBonus} THEN 5 
              ELSE 100 
            END `,
    });
  }

  private async recalculateCustomerBonusHistory(
    queryObj: SelectQueryBuilderBaseDto,
  ): Promise<CustomerResponseDto> {
    await this.prepareListsRegisterBalansForCalculate(queryObj);

    this.makeToRecalculateRegisterBalans();

    const listForUpdate = this.createListRecordsForUpdateToregisterBalans();

    await this.updateAllChangesInRegisterBalans(listForUpdate);

    const updatedCustomer = await this.saveNewBalansToCustomer();

    return updatedCustomer;
  }

  private async saveNewBalansToCustomer(): Promise<CustomerResponseDto> {
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

    return await this.customerService.updateCustomerById(this.manager, {
      id: this.customerId,
      amountBonus: newAmountBonus,
    });
  }

  private async updateAllChangesInRegisterBalans(
    listForUpdate: RegisterBalansUpdateShortDto[],
  ): Promise<void> {
    if (listForUpdate.length > 0) {
      const updateRegisterBalans = async (
        registerBalansUpdateShortDto: RegisterBalansUpdateShortDto,
      ): Promise<void> => {
        const { id, ...registryBalansUpdateDto } = registerBalansUpdateShortDto;
        await this.registerBalansService.updateRegisterBalansById(
          this.manager,
          id,
          registryBalansUpdateDto,
        );
      };

      await Promise.all(listForUpdate.map(updateRegisterBalans));
    }
  }

  private createListRecordsForUpdateToregisterBalans(): RegisterBalansUpdateShortDto[] {
    return this.rbList
      .filter((item, idx) => {
        const {
          activeType: activeTypeOld,
          bonus: bonusOld,
          usedBonus: usedBonusOld,
        } = this.fetchRegisterBalansList[idx];
        return (
          item.activeType !== activeTypeOld ||
          item.bonus !== parseFloat(bonusOld) ||
          item.usedBonus !== parseFloat(usedBonusOld)
        );
      })
      .map(({ id, activeType, bonus, usedBonus }) => ({
        id,
        activeType,
        bonus: bonus.toFixed(FIELDS_LENGTH.DECIMAL.SCALE),
        usedBonus: usedBonus.toFixed(FIELDS_LENGTH.DECIMAL.SCALE),
      }));
  }

  private makeToRecalculateRegisterBalans() {
    for (let idxMain: number = 0; idxMain < this.rbList.length; idxMain++) {
      const { documentType } = this.rbList[idxMain];

      this.closeOrActivateRecordsFromPreviousPeriod(idxMain);

      this.processingCurrentRegisterBalansRecordByType[documentType](idxMain);
    }
  }

  private closeOrActivateRecordsFromPreviousPeriod(currentIdx: number) {
    const { startDate } = this.fetchRegisterBalansList[currentIdx];
    for (let idx: number = 0; idx < currentIdx; idx++) {
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
  }

  private processingCurrentRegisterBalansRecordByType = {
    [DocumentType.Receipt]: (currentIdx: number): void =>
      this.processingOfRecordIfTypeAsReceipt(currentIdx),
    [DocumentType.ReceiptForReturn]: (currentIdx: number): void =>
      this.processingOfRecordIfTypeAsReceiptForReturn(currentIdx),
    [DocumentType.AddBonus]: (currentIdx: number): void =>
      this.processingOfRecordIfTypeAsAddBonus(currentIdx),
    [DocumentType.SpentBonus]: (currentIdx: number): void =>
      this.processingOfRecordIfTypeAsSpentAndRemoveBonus(currentIdx),
    [DocumentType.RemoveBonus]: (currentIdx: number): void =>
      this.processingOfRecordIfTypeAsSpentAndRemoveBonus(currentIdx),
  };

  private processingOfRecordIfTypeAsSpentAndRemoveBonus(currentIdx: number): void {
    this.rbList[currentIdx].activeType = ActiveType.Close;
    let spentBonus = this.rbList[currentIdx].bonus;

    for (let idx: number = 0; idx < currentIdx; idx++) {
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

  private processingOfRecordIfTypeAsAddBonus(currentIdx: number): void {
    this.rbList[currentIdx].activeType = ActiveType.Active;
  }

  private processingOfRecordIfTypeAsReceiptForReturn(currentIdx: number): void {
    this.rbList[currentIdx].activeType = ActiveType.Close;
  }

  private processingOfRecordIfTypeAsReceipt(currentIdx: number): void {
    const { documentUuid } = this.rbList[currentIdx];
    this.rbList[currentIdx].activeType = ActiveType.Active;

    this.rbList
      .filter(
        ({ documentReturnUuid, documentType }) =>
          documentReturnUuid === documentUuid && documentType === DocumentType.ReceiptForReturn,
      )
      .forEach(({ bonus }) => {
        this.rbList[currentIdx].usedBonus = this.rbList[currentIdx].usedBonus + bonus;
      });
  }

  private async prepareListsRegisterBalansForCalculate(
    queryObj: SelectQueryBuilderBaseDto,
  ): Promise<void> {
    const registerBalansList = await this.registerBalansService.getAllRecords(
      this.manager,
      queryObj,
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

  private createSelectQueryBuilderObjForRegisterSaving(): SelectQueryBuilderBaseDto {
    return plainToInstance(SelectQueryBuilderBaseDto, {
      conditions: {
        startDate: { lte: DATE.END_DATE(this.recalcDate) },
        customerId: this.customerId,
      },
      orderBy: { startDate: 'ASC' },
    });
  }
}
