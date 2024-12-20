import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { TABLE_NAMES } from '@src/db/const-tables';
import { DocumentType, RegisterBalansTypeMap } from './utils/types';
import { RegisterBalansDto } from './dto/register-balans.dto';
import { RegisterBalansResponseDto } from './dto/register-balans.response.dto';
import { RegisterBalans } from './register-balans.entity';
import { ReceiptResponseBaseDto } from '../receipt/dto/receipt.response.base.dto';
import { RegisterBalansUpdateDto } from './dto/register-balans.update.dto';
import { configureSelectQueryBuilder } from '@src/utils/filters-query-dto/add-select-query_builder';
import { PeriodDto } from '@src/types/period.dto';
import { get } from 'http';

const TABLE_NAME = TABLE_NAMES.register_balans;
@Injectable()
export class RegisterBalansService {
  constructor() {}

  public async getAllRecords(
    manager: EntityManager,
    queryObj: any,
  ): Promise<RegisterBalansResponseDto[]> {
    const sqb = manager.createQueryBuilder(RegisterBalans, TABLE_NAME);

    configureSelectQueryBuilder(sqb, queryObj);

    try {
      return await sqb.getMany();
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  public async getListCustomerIdByPeriod(
    manager: EntityManager,
    period: PeriodDto,
  ): Promise<number[]> {
    const { startDate, endDate } = period;

    const listCustomerId = await manager
      .createQueryBuilder(RegisterBalans, TABLE_NAME)

      .select(`${TABLE_NAME}.customerId`)
      .where(
        'start_date Between :startDateStart AND :startDateEnd or end_date BETWEEN :endDateStart AND :endDateEnd',
        {
          startDateStart: startDate,
          startDateEnd: endDate,
          endDateStart: startDate,
          endDateEnd: endDate,
        },
      )
      .groupBy(`${TABLE_NAME}.customerId`)
      .getMany();

    return listCustomerId.map(e => e.customerId);
  }

  public async getListCustomerId(manager: EntityManager): Promise<number[]> {
    const listCustomerId = await manager
      .createQueryBuilder(RegisterBalans, TABLE_NAME)
      .select(`${TABLE_NAME}.customerId`)
      .groupBy(`${TABLE_NAME}.customerId`)
      .getMany();

    return listCustomerId.map(e => e.customerId);
  }

  public async saveReceiptToRegisterBalans(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<void> {
    await this.saveAccuredBonus(manager, receiptResponseBaseDto);

    await this.saveSpentBonus(manager, receiptResponseBaseDto);
  }

  public async updateRegisterBalansById(
    manager: EntityManager,
    id: number,
    registerBalansUpdateDto: RegisterBalansUpdateDto,
  ): Promise<RegisterBalansResponseDto> {
    const fetchRecord = await manager.findOneBy(RegisterBalans, { id });

    const newRecord = manager.merge(RegisterBalans, fetchRecord, registerBalansUpdateDto);

    return await manager.save(RegisterBalans, newRecord);
  }

  private async saveAccuredBonus(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<void> {
    if (receiptResponseBaseDto.accuredBonus) {
      await this.saveRegisterBalans(manager, receiptResponseBaseDto, DocumentType.Receipt);
    }
  }

  private async saveSpentBonus(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<void> {
    const { spentBonus } = receiptResponseBaseDto;

    if (spentBonus && parseFloat(spentBonus) > 0) {
      await this.saveReisterBalansAsSpentBonus(manager, receiptResponseBaseDto);
    }
  }

  private async saveReisterBalansAsSpentBonus(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<RegisterBalansResponseDto> {
    const currentReceiptResponseBaseDTO = {
      ...receiptResponseBaseDto,
      startDate: new Date(),
      endDate: new Date(),
    };
    return await this.saveRegisterBalans(
      manager,
      currentReceiptResponseBaseDTO,
      DocumentType.SpentBonus,
    );
  }

  private async saveRegisterBalans(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    documentType: DocumentType,
  ): Promise<RegisterBalansResponseDto> {
    const newRegisterBalans = this.transformReceiptToRegisterBalans(
      receiptResponseBaseDto,
      documentType,
    );

    const result = await manager.save(TABLE_NAME, newRegisterBalans);

    return plainToInstance(RegisterBalansResponseDto, result);
  }

  private transformReceiptToRegisterBalans<T>(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    documentType: DocumentType,
  ): RegisterBalansDto {
    const activeType = RegisterBalansTypeMap[documentType].activeType;

    const registerBalansTransformDto = plainToInstance(
      RegisterBalansTypeMap[documentType].dtoClass,
      receiptResponseBaseDto,
      { strategy: 'excludeAll' },
    );

    return { ...registerBalansTransformDto, activeType, documentType };
  }
}
