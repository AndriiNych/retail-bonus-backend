import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { Customer } from './customer.entity';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';
import { CustomerResponseDto } from './dto/customer.response.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { CustomerUpdateDto } from './dto/customer.update.dto';
import { CustomerParamsDto } from './dto/customer.params.dto';
import { CustomerQueryParamsDto } from './dto/customer.query.params.dto';
import { CustomerPhonePatchDto } from './dto/customer-phone.patch.dto';
import { TABLE_NAMES } from '@src/db/const-tables';
import { CustomerUpdateBonusDto } from './dto/customer.update.bonus.dto';

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

    const result = await query.getMany();

    return responseWrapper(result, CustomerResponseDto);
  }

  public async getCustomerById(id: number): Promise<CustomerDto> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist.`);
    }

    return customer;
  }

  public async getCustomerByIdWithTransaction(
    id: number,
    manager: EntityManager,
  ): Promise<CustomerResponseDto> {
    const customer = await manager.findOneBy(Customer, { id });

    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist.`);
    }

    return customer;
  }

  public async getCustomerResponseById(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist.`);
    }

    return customer;
  }

  public async getCustomerByPhoneBase(
    customerParamsDto: CustomerParamsDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    const { phone } = customerParamsDto;

    const resultFind = await this.fetchCustomerByPhoneWithValidation(phone);

    const result = resultFind ? [resultFind] : [];

    return responseWrapper(result, CustomerResponseDto);
  }

  public async createCustomer(
    customerDto: CustomerDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    await this.isExistCustomer(customerDto.phone);

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

  public async updateCustomerById(
    manager: EntityManager,
    customer: CustomerUpdateBonusDto,
  ): Promise<CustomerResponseDto> {
    const { id } = customer;
    const fetchCustomer = await manager.findOneBy(Customer, { id });

    const newCustomer = manager.merge(Customer, fetchCustomer, { ...customer });

    return await manager.save(Customer, newCustomer);
  }

  public async updateCustomerByPhoneWithTransaction(
    customerParamsDto: CustomerParamsDto,
    customerUpdateDto: CustomerUpdateDto,
    manager: EntityManager,
  ): Promise<Customer> {
    const currentCustomer = await this.fetchCustomerByPhoneWithValidation(
      customerParamsDto.phone,
      manager,
    );

    const updatedCustomer = manager.merge(Customer, currentCustomer, customerUpdateDto);

    return await manager.save(Customer, updatedCustomer);
  }

  public async updateCustomerByPhone(
    customerParamsDto: CustomerParamsDto,
    customerUpdateDto: CustomerUpdateDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    const updatedCustomer = await this.saveCustomerByPhone(customerParamsDto, customerUpdateDto);

    return responseWrapper([updatedCustomer], CustomerResponseDto);
  }

  public async changePhoneNumber(
    customerParamsDto: CustomerParamsDto,
    customerPhonePatchDto: CustomerPhonePatchDto,
  ): Promise<ResponseWrapperDto<CustomerResponseDto>> {
    const { phone: newPhone } = customerPhonePatchDto;
    await this.isExistCustomer(newPhone);

    const updatedCustomer = await this.saveCustomerByPhone(
      customerParamsDto,
      customerPhonePatchDto,
    );

    return responseWrapper([updatedCustomer], CustomerResponseDto);
  }

  private async saveCustomerByPhone(
    customerParamsDto: CustomerParamsDto,
    customerUpdateDto: CustomerUpdateDto | CustomerPhonePatchDto,
  ): Promise<CustomerResponseDto> {
    const { phone } = customerParamsDto;
    const currentCustomer = await this.fetchCustomerByPhoneWithValidation(phone);

    const newCustomer = this.customerRepository.merge(currentCustomer, customerUpdateDto);

    return await this.customerRepository.save(newCustomer);
  }

  private getQueryByCriterial(
    customerQueryParamsDto: CustomerQueryParamsDto,
  ): SelectQueryBuilder<Customer> {
    const { updated_at } = customerQueryParamsDto;

    const query = this.customerRepository.createQueryBuilder(TABLE_NAMES.customer);

    if (updated_at) {
      query.andWhere(`${TABLE_NAMES.customer}.${COLUMN_UPDATED_AT} >= :${COLUMN_UPDATED_AT}`, {
        updated_at,
      });
    }

    return query;
  }

  private async getResultSaveCustomers(customers: CustomerDto[]): Promise<CustomerResponseDto[]> {
    const createNewCustomer = async (customer: CustomerDto): Promise<CustomerResponseDto> => {
      const { phone } = customer;
      const resultFind = await this.fetchCustomerByPhone(phone);
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

  private async isExistCustomer(phone: string): Promise<void> {
    const customer = await this.fetchCustomerByPhone(phone);
    if (customer) {
      throw new ConflictException(`Customer with phone: ${phone} already exists.`);
    }
  }

  private async fetchCustomerByPhoneWithValidation(
    phone: string,
    manager?: EntityManager,
  ): Promise<CustomerResponseDto> {
    const customer = await this.fetchCustomerByPhone(phone, manager);

    if (!customer) {
      throw new NotFoundException(`Customer with phone: ${phone} does not exist.`);
    }

    return customer;
  }

  private async fetchCustomerByPhone(
    phone: string,
    manager?: EntityManager,
  ): Promise<CustomerResponseDto> {
    if (manager) {
      return await manager.findOneBy(Customer, { phone });
    } else {
      return await this.customerRepository.findOneBy({ phone });
    }
  }
}
