import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './customer.entity';
import { CustomersDto } from './dto/customers.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public async getAllCustomers() {
    return await this.customerRepository.find();
  }

  public async createCustomers(customers: CustomersDto): Promise<Customer[]> {
    const newCustomers = this.customerRepository.create(customers.customers);
    return await this.customerRepository.save(newCustomers);
  }
}
