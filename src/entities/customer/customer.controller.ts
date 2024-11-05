import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  //TODO implement query with date >=
  @Get('/')
  async getAllCustomers() {
    return await this.customerService.getAllCustomers();
  }

  //TODO implement a feature
  @Get('/:phone')
  async getCustomerByPhone() {
    return '';
  }

  @Post('single')
  async createCustomer(@Body() customer: CustomerDto) {
    return await this.customerService.createCustomer(customer);
  }

  @Post('multiple')
  async createCustomers(@Body() customers: CustomersDto) {
    return await this.customerService.createCustomers(customers);
  }
}
