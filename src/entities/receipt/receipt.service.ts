import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Receipt } from './receipt.entity';
import { ReceiptDto } from './dto/receipt.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { ReceiptResponseDto } from './dto/receipt-response.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { ReceiptParamsDto } from './dto/receipt-params.dto';
import { ReceiptUpdateDto } from './dto/receipt-update.dto';
import { CustomerService } from '../customer/customer.service';
import { CustomerParamsDto } from '../customer/dto/customer.params.dto';
import { RegisterBalansService } from '../register-balans/register-balans.service';
import { wrapperResponseEntity } from '@src/utils/response-wrapper/wrapper-response-entity';
import { TABLE_NAMES } from '@src/db/const-tables';
import { ReceiptRepository } from './receipt.repository';
import { Customer } from '../customer/customer.entity';
import { plainToInstance } from 'class-transformer';
import { CustomerResponseDto } from '../customer/dto/customer.response.dto';
import { RegisterSavingService } from '../register-saving/register-saving.service';
import { isBonusEnoughToPay } from '@src/utils/check/isBonusEnough';
import { DATE } from '@src/utils/date';
import { RecalculateCustomer } from '@src/services/daily-tasks/service/recalculate.customer';
import { GeneralResponseDto } from '@src/types/general.response.dto';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly receiptRepository: ReceiptRepository,
    private readonly customerService: CustomerService,
    private readonly registerBalansService: RegisterBalansService,
    private readonly registerSavingService: RegisterSavingService,
    private readonly dataSource: DataSource,
    private readonly recalculateCustomer: RecalculateCustomer,
  ) {}

  public async getReceiptByUuid(
    receiptParamsDto: ReceiptParamsDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDto;

    const receipt = await this.receiptRepository.fetchReceiptByUuidWithValidation(uuid);

    const resultTransform = await this.transformCustomerIdToPhoneNumber(receipt);

    const result = resultTransform ? [resultTransform] : [];

    return responseWrapper(result, ReceiptResponseDto);
  }

  public async createReceipt(
    receiptDto: ReceiptDto,
  ): Promise<Record<string, GeneralResponseDto[]>> {
    const newReceipt = await this.prepareReceiptForSave(receiptDto);

    return await this.dataSource.transaction(async manager => {
      return await this.processSavingReceiptIntoTransaction(
        manager,
        newReceipt,
        receiptDto.customerPhone,
      );
    });
  }

  private async processSavingReceiptIntoTransaction(
    manager: EntityManager,
    newReceipt: Receipt,
    customerPhone: string,
  ): Promise<Record<string, GeneralResponseDto[]>> {
    const savedReceipt = await this.receiptRepository.saveWithValidationAndTransaction(
      newReceipt,
      manager,
    );
    const receiptResponseDto = this.transformToReceiptResponse(savedReceipt, customerPhone);

    const updatedCustomer = await this.processSavingDataFromReceiptToRegistryAndCustomer(
      manager,
      savedReceipt,
    );

    return this.getResultDataAfterSaveReceipt(receiptResponseDto, updatedCustomer);
  }

  private async processSavingDataFromReceiptToRegistryAndCustomer(
    manager: EntityManager,
    savedReceipt: Receipt,
  ): Promise<CustomerResponseDto> {
    await this.registerBalansService.saveReceiptToRegisterBalans(manager, savedReceipt);

    await this.registerSavingService.saveReceiptToRegisterSaving(manager, savedReceipt);

    this.recalculateCustomer.setParams(manager, savedReceipt.customerId, DATE.END_DATE(new Date()));

    return await this.recalculateCustomer.processDailyRecalculateCustomerByDateIntoTransaction();
  }

  private getResultDataAfterSaveReceipt(
    receipt: ReceiptResponseDto,
    customer: CustomerResponseDto,
  ): Record<string, GeneralResponseDto[]> {
    const resultReceipt = wrapperResponseEntity(receipt, ReceiptResponseDto, TABLE_NAMES.receipt);

    const resultCustomer = wrapperResponseEntity(
      customer,
      CustomerResponseDto,
      TABLE_NAMES.customer,
    );

    return { ...resultReceipt, ...resultCustomer };
  }

  private async prepareReceiptForSave(receiptDto: ReceiptDto): Promise<Receipt> {
    const customer = await this.fetchCustomerByPhone(receiptDto.customerPhone);

    isBonusEnoughToPay(customer.amountBonus, receiptDto.spentBonus);

    return this.transformToRecipe(receiptDto, customer.id);
  }

  //[x] commented method
  /* deleteReceipt - temporarily disabled
  public async deleteReceipt(
    receiptParamsDto: ReceiptParamsDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDto;

    const receipt = await this.receiptRepository.deleteReceiptByUuid(uuid);

    const resultTransform =
      await this.transformCustomerIdToPhoneNumber(receipt);

    const result = [resultTransform];

    return responseWrapper(result, ReceiptResponseDto);
  }
*/

  //[x] commented method
  /* updateReceiptByUuid: this method is disabled because the check should not change
  public async updateReceiptByUuid(
    receiptParamsDto: ReceiptParamsDto,
    receiptUpdateDto: ReceiptUpdateDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDto;

    await this.fetchReceiptByUuidWithValidation(uuid);

    const newReceiptUpdate =
      await this.transtormCustomerPhoneToCustomerId(receiptUpdateDto);

    const resultUpdate = await this.receiptRepository.update(
      { uuid },
      newReceiptUpdate,
    );

    const result = [];

    if (resultUpdate.affected === 1) {
      const receipt = await this.fetchReceiptByUuid(uuid);
      const resultTransform =
        await this.transformCustomerIdToPhoneNumber(receipt);
      result.push(resultTransform);
    }

    return responseWrapper(result, ReceiptResponseDto);
  }
*/
  //[x] commented method
  /*
  private async fetchReceiptByUuidWithValidation(
    uuid: string,
  ): Promise<ReceiptResponseBaseDto> {
    const receipt = await this.fetchReceiptByUuid(uuid);

    if (!receipt) {
      throw new NotFoundException(`Record with uuid ${uuid} does not exist.`);
    }

    return receipt;
  }
*/
  //[x] commented method
  /*
  private async fetchReceiptByUuid(
    uuid: string,
  ): Promise<ReceiptResponseBaseDto> {
    return await this.receiptRepository.findOneBy({ uuid });
  }
*/
  //[x] commented method
  /*
  private async isExistReceipt(uuid: string): Promise<void> {
    const receipt = await this.fetchReceiptByUuid(uuid);
    if (receipt) {
      throw new ConflictException(`Record with uuid: ${uuid} already exists.`);
    }
  }
*/

  private async fetchCustomerByPhone(phone: string): Promise<Customer> {
    const customerParamsDto = new CustomerParamsDto();
    customerParamsDto.phone = phone;

    const { data } = await this.customerService.getCustomerByPhoneBase(customerParamsDto);

    return data[0];
  }

  /*
  private async fetchCustomerIdByPhone(phone: string): Promise<number> {
    const { id: customerId } = await this.fetchCustomerByPhone(phone);

    return customerId;
  }
*/
  private transformToRecipe(receiptDto: ReceiptDto, customerId: number): Receipt {
    const receipt = this.receiptRepository.create(receiptDto);

    return { ...receipt, customerId };
  }

  private transformToReceiptResponse(receipt: Receipt, customerPhone: string): ReceiptResponseDto {
    const receiptResponseDto = plainToInstance(ReceiptResponseDto, receipt, {
      excludeExtraneousValues: true,
    });

    return { ...receiptResponseDto, customerPhone };
  }

  private async transformCustomerIdToPhoneNumber(receipt: Receipt): Promise<ReceiptResponseDto> {
    const { customerId, ...newReceipt } = receipt;

    const { phone: customerPhone } = await this.customerService.getCustomerById(customerId);

    const result = { ...newReceipt, customerPhone };

    return result;
  }

  //[x] method not used
  /*
  TODO Rename method and type in/out params
  private async transtormCustomerPhoneToCustomerId(
    receipt: ReceiptDto | ReceiptUpdateDto,
  ): Promise<Receipt> {
    const { customerPhone, ...newReceipt } = receipt;

    let resultReceipt: Receipt;

    if (customerPhone) {
      const customerId = await this.fetchCustomerIdByPhone(customerPhone);

      resultReceipt = this.receiptRepository.create(newReceipt);

      resultReceipt.customerId = customerId;
    } else {
      resultReceipt = this.receiptRepository.create(receipt);
    }

    return resultReceipt;
  }
*/
}
