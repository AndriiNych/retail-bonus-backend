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
import { isBonusEnough } from '@src/utils/check/isBonusEnough';
import { RegisterBalansUpdateDto } from './dto/register-balans.update.dto';
import { configureSelectQueryBuilder } from '@src/utils/filters-query-dto/add-select-query_builder';

const TABLE_NAME = TABLE_NAMES.register_balans;
@Injectable()
export class RegisterBalansService {
  constructor(
    @InjectRepository(RegisterBalans)
    private readonly registerBalansRepository: Repository<RegisterBalans>,
    private readonly customerService: CustomerService,
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

  public async createRecord(
    registerBalansDto: RegisterBalansDto,
  ): Promise<RegisterBalansResponseDto> {
    const newRegisterBalans = this.registerBalansRepository.create(registerBalansDto);

    const registerBalans = await this.registerBalansRepository.save(newRegisterBalans);

    return registerBalans;
  }

  public async saveReceiptToRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    await this.saveAcuredBonus(receiptResponseBaseDto, manager);

    //[x]  perhaps you need to decompose saveSpentBonus into pure saceSpentBonus and saveChangeCustomer
    const updatedCustomer = await this.saveSpentBonus(receiptResponseBaseDto, manager);

    return updatedCustomer;
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

  private async saveAcuredBonus(
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
  ): Promise<CustomerResponseDto> {
    const { customerId, spentBonus } = receiptResponseBaseDto;

    let updatedCustomer: CustomerResponseDto;

    if (spentBonus) {
      await this.saveReisterBalansAsSpentBonus(receiptResponseBaseDto, manager);

      await this.allocateSpentBonus(receiptResponseBaseDto, manager);

      updatedCustomer = await this.updateBonusByCustomerId(
        customerId,
        spentBonus,
        DocumentType.SpentBonus,
        manager,
      );
    }

    return updatedCustomer;
  }

  private async allocateSpentBonus(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<void> {
    const { customerId } = receiptResponseBaseDto;

    const listRegisterBalans = await manager.find(RegisterBalans, {
      where: { customerId: customerId, activeType: ActiveType.Active },
      order: { startDate: 'ASC' },
    });

    let spentBonus = parseFloat(receiptResponseBaseDto.spentBonus);
    for (const e of listRegisterBalans) {
      const sub = parseFloat(MATH.DECIMAL.subtract(e.bonus, e.usedBonus));
      const newRegisterBalans = { ...e };
      if (sub !== 0 && spentBonus !== 0) {
        const delta = spentBonus - sub;
        if (delta > 0) {
          newRegisterBalans.usedBonus = newRegisterBalans.bonus;
          spentBonus = delta;
        } else if (delta === 0) {
          newRegisterBalans.usedBonus = newRegisterBalans.bonus;
          spentBonus = 0;
        } else {
          newRegisterBalans.usedBonus = MATH.DECIMAL.add(
            newRegisterBalans.usedBonus,
            spentBonus.toString(),
          );
          spentBonus = 0;
        }
        await manager.save(TABLE_NAME, newRegisterBalans);
      }
    }
  }

  private async saveReisterBalansAsSpentBonus(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<RegisterBalansResponseDto> {
    return await this.saveRegisterBalans(receiptResponseBaseDto, DocumentType.SpentBonus, manager);
  }

  private async updateBonusByCustomerId(
    customerId: number,
    spentBonus: string,
    documentType: DocumentType,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    let currentCustomer = await this.fetchCustomerById(customerId, manager);

    isBonusEnough(currentCustomer.amountBonus, spentBonus);

    if (parseFloat(spentBonus) !== 0) {
      currentCustomer.amountBonus = RegisterBalansTypeMap[documentType].operation(
        currentCustomer.amountBonus,
        spentBonus,
      );

      currentCustomer = await this.customerService.updateCustomerByPhoneWithTransaction(
        currentCustomer,
        currentCustomer,
        manager,
      );
    }

    return currentCustomer;
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

  //[x] commented method
  /* this method is disabled because checking records for existence is performed when writing a receipt
  private async checkBeforeCommit(documentUuid: string): Promise<void> {
    const registerBalans = await this.registerBalansRepository.findOneBy({
      documentUuid,
    });

    if (registerBalans) {
      throw new ConflictException(
        `Record with documentUuid: ${documentUuid} already exists. You must first perform Rollback. `,
      );
    }
  }
*/

  private async fetchCustomerById(
    customerId: number,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.getCustomerByIdWithTransaction(customerId, manager);
  }
}
