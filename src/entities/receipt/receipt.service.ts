import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './receipt.entity';
import { ReceiptDto } from './dto/receipt.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { ReceiptResponseDto } from './dto/receipt-response.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { ReceiptParamsDto } from './dto/receipt-params.dto';
import { ReceiptUpdateDto } from './dto/receipt-update.dto';
import { CustomerService } from '../customer/customer.service';
import { CustomerParamsDto } from '../customer/dto/customer-params.dto';
import { ReceiptResponseBaseDto } from './dto/receipt-response-base.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    private readonly customerService: CustomerService,
  ) {}

  public async createReceipt(
    receiptDto: ReceiptDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    await this.isExistReceipt(receiptDto.uuid);

    const newReceipt =
      await this.transtormCustomerPhoneToCustomerId(receiptDto);

    const resultSave = await this.receiptRepository.save(newReceipt);

    const resultTransform =
      await this.transformCustomerIdToPhoneNumber(resultSave);

    const result = resultTransform ? [resultTransform] : [];

    return responseWrapper(result, ReceiptResponseDto);
  }

  public async deleteReceipt(
    receiptParamsDto: ReceiptParamsDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDto;

    const receipt = await this.fetchReceiptByUuidWithValidation(uuid);

    await this.receiptRepository.delete({ uuid });

    const resultTransform =
      await this.transformCustomerIdToPhoneNumber(receipt);

    const result = [resultTransform];

    return responseWrapper(result, ReceiptResponseDto);
  }

  public async getReceiptByUuid(
    receiptParamsDto: ReceiptParamsDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDto;

    const receipt = await this.fetchReceiptByUuidWithValidation(uuid);

    const resultTransform =
      await this.transformCustomerIdToPhoneNumber(receipt);

    const result = resultTransform ? [resultTransform] : [];

    return responseWrapper(result, ReceiptResponseDto);
  }

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

  private async fetchReceiptByUuidWithValidation(
    uuid: string,
  ): Promise<ReceiptResponseBaseDto> {
    const receipt = await this.fetchReceiptByUuid(uuid);

    if (!receipt) {
      throw new NotFoundException(`Record with uuid ${uuid} does not exist.`);
    }

    return receipt;
  }

  private async fetchReceiptByUuid(
    uuid: string,
  ): Promise<ReceiptResponseBaseDto> {
    return await this.receiptRepository.findOneBy({ uuid });
  }

  private async isExistReceipt(uuid: string): Promise<void> {
    const receipt = await this.fetchReceiptByUuid(uuid);
    if (receipt) {
      throw new ConflictException(`Record with uuid: ${uuid} already exists.`);
    }
  }

  private async fetchCustomerIdByPhone(phone: string): Promise<number> {
    const customerParamsDto = new CustomerParamsDto();
    customerParamsDto.phone = phone;

    const { data } =
      await this.customerService.getCustomerByPhoneBase(customerParamsDto);

    return data[0].id;
  }

  private async transformCustomerIdToPhoneNumber(
    receipt: Receipt,
  ): Promise<ReceiptResponseDto> {
    const { customerId, ...newReceipt } = receipt;

    const { phone: customerPhone } =
      await this.customerService.getCustomerById(customerId);

    const result = { ...newReceipt, customerPhone };

    return result;
  }

  //TODO Rename method and type in/out params
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
}
