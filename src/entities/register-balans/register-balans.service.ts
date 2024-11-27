import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const newRegisterBalans =
      this.registerBalansRepository.create(registerBalansDto);
    const registerBalans =
      await this.registerBalansRepository.save(newRegisterBalans);

    return registerBalans;
  }

  public async CommitReceiptToRegisterBalans(
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<CustomerResponseDto> {
    const { uuid, customerId, accruedBonus, spentBonus } =
      receiptResponseBaseDto;

    await this.checkBeforeCommit(uuid);

    // transform Receipt to RegisterBalans: accuredBonus &  spentBonus
    // and createRecord or update

    const result = await this.fetchCustomerById(customerId);

    return result;
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
