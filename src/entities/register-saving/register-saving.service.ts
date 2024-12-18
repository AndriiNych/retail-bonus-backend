import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterSaving } from './register-saving.entity';
import { EntityManager, Repository } from 'typeorm';
import { RegisterSavingDto } from './dto/register-saving.dto';
import { RegisterSavingResponseDto } from './dto/register-saving-response.dto';
import { ReceiptResponseBaseDto } from '../receipt/dto/receipt-response-base.dto';
import { CustomerResponseDto } from '../customer/dto/customer-response.dto';
import { plainToInstance } from 'class-transformer';
import { TransformToRegisterSavingBaseDto } from './dto/register-saving-transform.dto';
import { CustomerService } from '../customer/customer.service';
import { MATH } from '@src/utils/math.decimal';
import { TABLE_NAMES } from '@src/db/const-tables';
import { configureSelectQueryBuilder } from '@src/utils/filters-query-dto/add-select-query_builder';
import { DATE } from '@src/utils/date';

const TABLE_NAME = TABLE_NAMES.register_saving;
@Injectable()
export class RegisterSavingService {
  constructor(
    @InjectRepository(RegisterSaving)
    private readonly registerSavingRepository: Repository<RegisterSaving>,
    private readonly customerService: CustomerService,
  ) {}

  public async getAllRecords(
    manager: EntityManager,
    queryObj: any,
  ): Promise<RegisterSavingResponseDto[]> {
    const sqb = manager.createQueryBuilder(RegisterSaving, TABLE_NAME);

    configureSelectQueryBuilder(sqb, queryObj);

    try {
      return await sqb.getMany();
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  public async saveReceiptToRegisterSaving(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<void> {
    const { saving } = receiptResponseBaseDto;

    if (!saving) return;

    const registerSavingDto = plainToInstance(
      TransformToRegisterSavingBaseDto,
      receiptResponseBaseDto,
      {
        strategy: 'excludeAll',
      },
    );
    const newRegisterSavingDto = { ...registerSavingDto, startDate: new Date() };

    await this.saveRegisterSaving(manager, newRegisterSavingDto);
  }

  public async saveRegisterSaving(
    manager: EntityManager,
    registerSavingDto: RegisterSavingDto,
  ): Promise<RegisterSavingResponseDto> {
    return await manager.save(RegisterSaving, registerSavingDto);
  }

  // private async updateSavingByCustomerId(
  //   customerId: number,
  //   saving: string,
  //   manager: EntityManager,
  // ): Promise<CustomerResponseDto> {
  //   let currentCustomer = await this.fetchCustomerById(customerId, manager);

  //   if (parseFloat(saving) !== 0) {
  //     currentCustomer.amountBox = MATH.DECIMAL.add(currentCustomer.amountBox, saving);

  //     currentCustomer = await this.customerService.updateCustomerByPhoneWithTransaction(
  //       currentCustomer,
  //       currentCustomer,
  //       manager,
  //     );
  //   }

  //   return currentCustomer;
  // }

  //FIXME Maybe you need to put this method in a separate class?
  private async fetchCustomerById(
    customerId: number,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.getCustomerByIdWithTransaction(customerId, manager);
  }
}
