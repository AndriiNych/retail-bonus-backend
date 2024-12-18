import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { TABLE_NAMES } from '@src/db/const-tables';
import { ActiveType, DocumentType, RegisterBalansTypeMap } from './utils/types';
import { RegisterBalansDto } from './dto/register-balans.dto';
import { RegisterBalansResponseDto } from './dto/register-balans-response.dto';
import { RegisterBalans } from './register-balans.entity';
import { ReceiptResponseBaseDto } from '../receipt/dto/receipt-response-base.dto';
import { CustomerResponseDto } from '../customer/dto/customer-response.dto';
import { CustomerService } from '../customer/customer.service';
import { MATH } from '@src/utils/math.decimal';
import { isBonusEnoughToPay } from '@src/utils/check/isBonusEnough';
import { RegisterBalansUpdateDto } from './dto/register-balans.update.dto';
import { configureSelectQueryBuilder } from '@src/utils/filters-query-dto/add-select-query_builder';

const TABLE_NAME = TABLE_NAMES.register_balans;
@Injectable()
export class RegisterBalansService {
  constructor(
    @InjectRepository(RegisterBalans)
    private readonly registerBalansRepository: Repository<RegisterBalans>,
    // private readonly customerService: CustomerService,
  ) {}

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

  public async getListCustomerId(manager: EntityManager): Promise<number[]> {
    const listCustomerId = await manager
      .createQueryBuilder(RegisterBalans, TABLE_NAME)
      .select(`${TABLE_NAME}.customerId`)
      .groupBy(`${TABLE_NAME}.customerId`)
      .getMany();

    return listCustomerId.map(e => e.customerId);
  }

  // public async createRecord(
  //   registerBalansDto: RegisterBalansDto,
  // ): Promise<RegisterBalansResponseDto> {
  //   const newRegisterBalans = this.registerBalansRepository.create(registerBalansDto);

  //   const registerBalans = await this.registerBalansRepository.save(newRegisterBalans);

  //   return registerBalans;
  // }

  public async saveReceiptToRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<void> {
    await this.saveAccuredBonus(receiptResponseBaseDto, manager);

    await this.saveSpentBonus(receiptResponseBaseDto, manager);
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
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<void> {
    if (receiptResponseBaseDto.accuredBonus) {
      await this.saveRegisterBalans(receiptResponseBaseDto, DocumentType.Receipt, manager);
    }
  }

  private async saveSpentBonus(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<void> {
    const { spentBonus } = receiptResponseBaseDto;

    if (spentBonus) {
      await this.saveReisterBalansAsSpentBonus(receiptResponseBaseDto, manager);
    }
  }

  private async saveReisterBalansAsSpentBonus(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<RegisterBalansResponseDto> {
    const currentReceiptResponseBaseDTO = {
      ...receiptResponseBaseDto,
      startDate: new Date(),
      endDate: new Date(),
    };
    return await this.saveRegisterBalans(
      currentReceiptResponseBaseDTO,
      DocumentType.SpentBonus,
      manager,
    );
  }

  private async saveRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    documentType: DocumentType,
    manager: EntityManager,
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
