import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { TABLE_NAMES } from '@src/db/const-tables';
import { DocumentType, RegisterBalansTypeMap } from './utils/types';
import { RegisterBalansDto } from './dto/register-balans.dto';
import { RegisterBalansResponseDto } from './dto/register-balans-response.dto';
import { RegisterBalans } from './register-balans.entity';
import { ReceiptResponseBaseDto } from '../receipt/dto/receipt-response-base.dto';
import { CustomerResponseDto } from '../customer/dto/customer-response.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class RegisterBalansService {
  constructor(
    @InjectRepository(RegisterBalans)
    private readonly registerBalansRepository: Repository<RegisterBalans>,
    private readonly customerService: CustomerService,
  ) {}

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

      //FIXME insert calculate usedBonus

      updatedCustomer = await this.updateBonusByCustomerId(
        customerId,
        spentBonus,
        DocumentType.SpentBonus,
        manager,
      );
    }

    return updatedCustomer;
  }

  private async saveReisterBalansAsSpentBonus(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<RegisterBalansResponseDto> {
    return await this.saveRegisterBalans(receiptResponseBaseDto, DocumentType.SpentBonus, manager);
  }

  private async updateBonusByCustomerId(
    customerId: number,
    bonus: string,
    documentType: DocumentType,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    let currentCustomer = await this.fetchCustomerById(customerId, manager);

    if (parseFloat(bonus) !== 0) {
      currentCustomer.amountBonus = RegisterBalansTypeMap[documentType].operation(
        currentCustomer.amountBonus,
        bonus,
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

    const result = await manager.save(TABLE_NAMES.register_balans, newRegisterBalans);

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

  private async fetchCustomerById(
    customerId: number,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.getCustomerByIdWithTransaction(customerId, manager);
  }
}
