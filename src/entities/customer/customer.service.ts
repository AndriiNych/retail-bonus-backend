import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './customer.entity';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public async getAllCustomers() {
    return await this.customerRepository.find();
  }

  public async createCustomer(customerDto: CustomerDto): Promise<Customer> {
    const newCustomer = this.customerRepository.create(customerDto);
    //TODO check for the uniqueness of phone numbers in the database
    return await this.customerRepository.save(newCustomer);
  }

  public async createCustomers(
    customersDto: CustomersDto,
  ): Promise<Customer[]> {
    const newCustomers = this.customerRepository.create(customersDto.customers);
    //TODO check for the uniqueness of phone numbers in the database
    return await this.customerRepository.save(newCustomers);
  }
}
