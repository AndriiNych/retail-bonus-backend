import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Customer } from './customer.entity';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerParamsDto } from './dto/customer-params.dto';
import { CustomerQueryParamsDto } from './dto/customer-query-params.dto';

const TABLE_NAME = 'customers';
const COLUMN_UPDATED_AT = 'updated_at';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public async getAllCustomers(
    customerQueryParamsDto: CustomerQueryParamsDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    const query = this.getQueryByCriterial(customerQueryParamsDto);

    const resultSave = await query.getMany();

    const result = resultSave ? [...resultSave] : [];

    return responseWrapper(result, CustomerResponseDto);
  }

  public async getCustomerByPhone(
    customerParamsDto: CustomerParamsDto,
  ): Promise<ResponseWrapperDto<CustomerDto>> {
    const { phone } = customerParamsDto;

    const resultFind = await this.customerRepository.findOneBy({ phone });

    const result = resultFind ? [resultFind] : [];

    return responseWrapper(result, CustomerResponseDto);
  }

  public async createCustomer(
    customerDto: CustomerDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    await this.validateExistenceByPhone(customerDto.phone);

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

  public async updateCustomerByPhone(
    customerParamsDto: CustomerParamsDto,
    customerUpdateDto: CustomerUpdateDto,
  ): Promise<ResponseWrapperDto<CustomerDto>> {
    const { phone } = customerParamsDto;
    const resultUpdate = await this.customerRepository.update(
      { phone },
      customerUpdateDto,
    );

    const result = [];

    if (resultUpdate.affected === 1) {
      result.push(await this.customerRepository.findOneBy({ phone }));
    }

    return responseWrapper(result, CustomerResponseDto);
  }

  private getQueryByCriterial(
    customerQueryParamsDto: CustomerQueryParamsDto,
  ): SelectQueryBuilder<Customer> {
    const { updated_at } = customerQueryParamsDto;

    const query = this.customerRepository.createQueryBuilder(TABLE_NAME);

    if (updated_at) {
      query.andWhere(
        `${TABLE_NAME}.${COLUMN_UPDATED_AT} >= :${COLUMN_UPDATED_AT}`,
        { updated_at },
      );
    }

    return query;
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

  private async validateExistenceByPhone(phone: string): Promise<void> {
    const customer = await this.customerRepository.findOneBy({ phone });
    if (customer) {
      throw new ConflictException(
        `Record with phone: ${phone} already exists.`,
      );
    }
  }
}
