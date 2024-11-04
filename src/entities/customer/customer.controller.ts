import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import { CustomerService } from './customer.service';
// import { CreateCustomerDto } from './dto/customer.dto';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  //TODO check all API “responses” and bring them to the same standard
  @Get('/')
  @HttpCode(200)
  async getAllCustomers() {
    const customers = await this.customerService.getAllCustomers();
    return { status: 'ok', data: customers };
  }

  //TODO check the uniqueness of the phone number
  @Post('single')
  async createCustomer(@Body() customer: CustomerDto) {
    console.log(customer);
    return customer;
    // return await this.customerService.createCustomer(customer);
  }

  @Post('multiple')
  async createCustomers(@Body() customers: CustomersDto) {
    return customers;
    //await this.customerService.createCustomers(customers);
  }
}
