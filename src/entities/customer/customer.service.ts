import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './customer.entity';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public async getAllCustomers(): Promise<
    ResponseWrapperDto<CustomerResponseDto>
  > {
    const resultSave = await this.customerRepository.find();

    const result = resultSave ? [...resultSave] : [];

    return responseWrapper(result, CustomerResponseDto);
  }

  public async createCustomer(
    customerDto: CustomerDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    await this.validateEsistenceByPhone(customerDto.phone);

    const newCustomer = this.customerRepository.create(customerDto);

    const resultSave = await this.customerRepository.save(newCustomer);

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, CustomerResponseDto);
  }

  public async createCustomers(
    customersDto: CustomersDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    const { customers } = customersDto;

    const resultSave = await this.getResultSaveCustomers(customers);

    const result = resultSave ? [...resultSave] : [];

    return responseWrapper(result, CustomerResponseDto);
  }

  private async getResultSaveCustomers(
    customers: CustomerDto[],
  ): Promise<CustomerResponseDto[]> {
    const createNewCustomer = async (
      customer: CustomerDto,
    ): Promise<CustomerResponseDto> => {
      const { phone } = customer;
      const resultFind = await this.customerRepository.findOneBy({ phone });
      if (resultFind) {
        return resultFind;
      }

      const newCustomer = this.customerRepository.create(customer);
      const resultSave = await this.customerRepository.save(newCustomer);

      return resultSave;
    };

    const result = await Promise.all(customers.map(createNewCustomer));

    return result;
  }

  private async validateEsistenceByPhone(phone: string): Promise<void> {
    const customer = await this.customerRepository.findOneBy({ phone });
    if (customer) {
      throw new ConflictException(
        `Record with phone: ${phone} already exists.`,
      );
    }
  }
}
