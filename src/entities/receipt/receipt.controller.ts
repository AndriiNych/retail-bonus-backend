import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptDto } from './dto/receipt.dto';
import { ReceiptResponseDto } from './dto/receipt-response.dto';
import { ReceiptUpdateDto } from './dto/receipt-update.dto';
import { ReceiptParamsDto } from './dto/receipt-params.dto';

@ApiBearerAuth()
@ApiTags('Receipts')
@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Delete('/:uuid')
  async deleteReceiptByUuid(@Param() receiptParamsDto: ReceiptParamsDto) {
    return await this.receiptService.deleteReceipt(receiptParamsDto);
  }

  @Get('/')
  async getAllReceipts() {
    return { data: 'test' };
  }

  @Get('/:uuid')
  async getReceiptsByUuid(@Param() receiptParamsDto: ReceiptParamsDto) {
    return {};
  }

  @Post('/')
  async createReceipt(@Body() receiptDto: ReceiptDto) {
    return await this.receiptService.createReceipt(receiptDto);
  }

  @Put('/:uuid')
  async updateReceiptByUuid(
    @Param() receiptResponseDto: ReceiptResponseDto,
    @Body() receiptUpdateDto: ReceiptUpdateDto,
  ) {
    return await this.receiptService.updateReceiptByUuid(
      receiptResponseDto,
      receiptUpdateDto,
    );
  }
}
