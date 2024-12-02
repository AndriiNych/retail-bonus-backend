import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterBalansDto } from './dto/register-balans.dto';
import { RegisterBalansResponseDto } from './dto/register-balans-response.dto';
import { RegisterBalans } from './register-balans.entity';
import { ReceiptResponseBaseDto } from '../receipt/dto/receipt-response-base.dto';
import { CustomerResponseDto } from '../customer/dto/customer-response.dto';
import { CustomerService } from '../customer/customer.service';
import { MATH } from '@src/utils/math.decimal';
import { wrapperResponseEntity } from '@src/utils/response-wrapper/wrapper-response-entity';
import { TABLES } from '@src/db/const-tables';

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
    const newRegisterBalans =
      this.registerBalansRepository.create(registerBalansDto);
    const registerBalans =
      await this.registerBalansRepository.save(newRegisterBalans);

    return registerBalans;
  }

  public async CommitReceiptToRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<Record<string, CustomerResponseDto[]>> {
    const { uuid, customerId, accuredBonus, spentBonus } =
      receiptResponseBaseDto;

    await this.checkBeforeCommit(uuid);

    if (accuredBonus) {
      await this.saveRegisterBalans(receiptResponseBaseDto, accuredBonus);
    }

    if (spentBonus) {
      await this.saveRegisterBalans(receiptResponseBaseDto, spentBonus);
      await this.deleteSpentBonusFromCustomer(customerId, spentBonus);
    }

    const result = await this.fetchCustomerById(customerId);

    const resultEnd = wrapperResponseEntity(
      [result],
      CustomerResponseDto,
      TABLES.customer,
    );

    return resultEnd;
  }

  private async deleteSpentBonusFromCustomer(
    customerId: number,
    spentBonus: string,
  ): Promise<CustomerResponseDto> {
    let currentCustomer = await this.fetchCustomerById(customerId);

    if (parseFloat(spentBonus) !== 0) {
      currentCustomer.amountBonus = MATH.DECIMAL.subtract(
        currentCustomer.amountBonus,
        spentBonus,
      );
      const updatedCustomerResponse = (
        await this.customerService.updateCustomerByPhone(
          currentCustomer,
          currentCustomer,
        )
      ).data[0];
      currentCustomer = { ...updatedCustomerResponse };
    }

    return currentCustomer;
  }

  private async addSpentBonusFromCustomer(
    customerId: number,
    spentBonus: string,
  ): Promise<CustomerResponseDto> {
    let currentCustomer = await this.fetchCustomerById(customerId);

    if (parseFloat(spentBonus) !== 0) {
      currentCustomer.amountBonus = MATH.DECIMAL.add(
        currentCustomer.amountBonus,
        spentBonus,
      );
      const updatedCustomerResponse = (
        await this.customerService.updateCustomerByPhone(
          currentCustomer,
          currentCustomer,
        )
      ).data[0];
      currentCustomer = { ...updatedCustomerResponse };
    }

    return currentCustomer;
  }

  private async saveRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    bonus: string,
  ): Promise<RegisterBalansResponseDto> {
    const newRegisterBalans = this.transformReceiptToRegisterBalans(
      receiptResponseBaseDto,
      bonus,
    );

    const savedRegisterBalans =
      await this.registerBalansRepository.save(newRegisterBalans);

    return savedRegisterBalans;
  }

  private transformReceiptToRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    bonus: string,
  ): RegisterBalansResponseDto {
    const {
      id,
      uuid: documentUuid,
      returnUuid: documentReturnUuid,
      ...baseParams
    } = receiptResponseBaseDto;

    const newRegisterBalansBase =
      this.registerBalansRepository.create(baseParams);
    const newRegisterBalans = {
      ...newRegisterBalansBase,
      documentUuid,
      documentReturnUuid,
    };

    console.log(newRegisterBalans);

    newRegisterBalans.bonus = bonus;
    return newRegisterBalans;
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
  ): Promise<CustomerResponseDto> {
    const result =
      await this.customerService.getCustomerResponseById(customerId);

    return result;
  }
}
