import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import { CustomerService } from './customer.service';
// import { CreateCustomerDto } from './dto/customer.dto';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/')
  @HttpCode(200)
  async getAllCustomers() {
    const customers = await this.customerService.getAllCustomers();
    return { status: 'ok', data: customers };
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
