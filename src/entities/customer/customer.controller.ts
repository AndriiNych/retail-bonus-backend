import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerParamsDto } from './dto/customer-params.dto';

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

  @Put(':phone')
  async updateCustomer(
    @Param() customerParamsDto: CustomerParamsDto,
    @Body() customerUpdateDto: CustomerUpdateDto,
  ) {
    return await this.customerService.updateCustomerByPhone(
      customerParamsDto,
      customerUpdateDto,
    );
  }
}
