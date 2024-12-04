import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CustomersDto } from './dto/customers.dto';
import { CustomerDto } from './dto/customer.dto';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerParamsDto } from './dto/customer-params.dto';
import { CustomerQueryParamsDto } from './dto/customer-query-params.dto';
import { CustomerPhonePatchDto } from './dto/customer-phone-patch.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TABLE_NAMES } from '@src/db/const-tables';

@ApiBearerAuth()
@ApiTags(TABLE_NAMES.customer)
@Controller(TABLE_NAMES.customer)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/')
  async getAllCustomers(@Query() customerQueryParamsDto: CustomerQueryParamsDto) {
    return await this.customerService.getAllCustomers(customerQueryParamsDto);
  }

  @Get('/:phone')
  async getCustomerByPhone(@Param() customerParamsDto: CustomerParamsDto) {
    return await this.customerService.getCustomerByPhoneBase(customerParamsDto);
  }

  @Patch(':phone')
  async patchCustomerPhoneNumber(
    @Param() customerParamsDto: CustomerParamsDto,
    @Body() customerPhonePatchDto: CustomerPhonePatchDto,
  ) {
    return await this.customerService.changePhoneNumber(customerParamsDto, customerPhonePatchDto);
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
    return await this.customerService.updateCustomerByPhone(customerParamsDto, customerUpdateDto);
  }
}
