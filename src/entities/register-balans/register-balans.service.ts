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
import { plainToInstance } from 'class-transformer';
import {
  RegisterBalansAccuredBonusTransformDto,
  RegisterBalansSpentBonusTransformDto,
} from './dto/register-balans.transform.dto';

enum ActiveType {
  Future = 0,
  Active = 1,
  Close = 99,
}

enum DocumentType {
  Receipt = 1,
  ReceiptForReturn = 2,
  AddBonus = 11,
  RemoveBonus = 12,
  SpentBonus = 22,
}

const RegisterBalansTypeMap: Record<
  DocumentType,
  { activeType: ActiveType; dtoClass: new () => any }
> = {
  [DocumentType.Receipt]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
  },
  //
  [DocumentType.ReceiptForReturn]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
  },
  [DocumentType.AddBonus]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
  },
  [DocumentType.RemoveBonus]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
  },
  //
  [DocumentType.SpentBonus]: {
    activeType: ActiveType.Close,
    dtoClass: RegisterBalansSpentBonusTransformDto,
  },
};

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
      await this.saveRegisterBalans(
        receiptResponseBaseDto,
        DocumentType.Receipt,
      );
    }

    if (spentBonus) {
      await this.saveRegisterBalans(
        receiptResponseBaseDto,
        DocumentType.SpentBonus,
      );
      await this.deleteSpentBonusFromCustomer(customerId, spentBonus);
      //TODO to create a function that will use the FIFO method to distribute the withdrawn amount according to the available bonus accruals
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
    documentType: DocumentType,
  ): Promise<RegisterBalansResponseDto> {
    const newRegisterBalans = this.transformReceiptToRegisterBalans(
      RegisterBalansTypeMap[documentType].dtoClass,
      receiptResponseBaseDto,
      documentType,
    );

    return await this.registerBalansRepository.save(newRegisterBalans);
  }

  /*
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
*/

  private transformReceiptToRegisterBalans<T>(
    responseDtoClass: new () => T,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
    // activeType: ActiveType,
    documentType: DocumentType,
  ): RegisterBalansDto {
    const resultPlain = plainToInstance(
      responseDtoClass,
      receiptResponseBaseDto,
      { strategy: 'excludeAll' },
    );

    let activeType: ActiveType;
    switch (documentType) {
      case DocumentType.AddBonus:
      case DocumentType.RemoveBonus:
        activeType = ActiveType.Future;
        break;
      case DocumentType.SpentBonus:
        activeType = ActiveType.Close;
        break;
      case DocumentType.Receipt:
      case DocumentType.ReceiptForReturn:
        activeType = ActiveType.Future;
        break;
    }

    const resultDto = { ...resultPlain, activeType, documentType };

    const result = plainToInstance(RegisterBalansDto, resultDto);
    console.log(result);

    return result;
  }

  /*
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

    newRegisterBalans.bonus = bonus;
    return newRegisterBalans;
  }
*/
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
