import { Injectable } from '@nestjs/common';
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

@Injectable()
export class RegisterSavingService {
  constructor(
    @InjectRepository(RegisterSaving)
    private readonly registerSavingRepository: Repository<RegisterSaving>,
    private readonly customerService: CustomerService,
  ) {}

  public async saveReceiptToRegisterSaving(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    const { saving } = receiptResponseBaseDto;

    if (!saving) return;

    const registerSavingDto = plainToInstance(
      TransformToRegisterSavingBaseDto,
      receiptResponseBaseDto,
      {
        strategy: 'excludeAll',
      },
    );

    await this.saveRegisterSaving(registerSavingDto, manager);

    const updatedCustomer = await this.updateSavingByCustomerId(
      receiptResponseBaseDto.customerId,
      registerSavingDto.amount,
      manager,
    );

    return updatedCustomer;
  }

  public async saveRegisterSaving(
    registerSavingDto: RegisterSavingDto,
    manager: EntityManager,
  ): Promise<RegisterSavingResponseDto> {
    return await manager.save(RegisterSaving, registerSavingDto);
  }

  private async updateSavingByCustomerId(
    customerId: number,
    saving: string,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    let currentCustomer = await this.fetchCustomerById(customerId, manager);

    if (parseFloat(saving) !== 0) {
      currentCustomer.amountBox = MATH.DECIMAL.add(currentCustomer.amountBox, saving);

      currentCustomer = await this.customerService.updateCustomerByPhoneWithTransaction(
        currentCustomer,
        currentCustomer,
        manager,
      );
    }

    return currentCustomer;
  }

  //FIXME Maybe you need to put this method in a separate class?
  private async fetchCustomerById(
    customerId: number,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.getCustomerByIdWithTransaction(customerId, manager);
  }
}
