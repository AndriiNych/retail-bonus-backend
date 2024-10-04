import { Controller, Get, HttpCode } from '@nestjs/common';

import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/')
  @HttpCode(200)
  async getAllCustomers() {
    const customers = await this.customerService.getAllCustomers();
    return { status: 'ok', data: customers };
  }
}
