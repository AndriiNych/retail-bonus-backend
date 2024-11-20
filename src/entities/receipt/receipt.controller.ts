import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Receipts')
@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Delete('/:uuid')
  async deleteReceiptByUuid() {
    return {};
  }

  @Get('/')
  async getAllReceipts() {
    return { data: 'test' };
  }

  @Get('/:uuid')
  async getReceiptsByUuid() {
    return {};
  }

  @Post('/')
  async createReceipt() {
    return {};
  }

  @Put('/:uuid')
  async updateReceiptByUuid() {
    return {};
  }
}
