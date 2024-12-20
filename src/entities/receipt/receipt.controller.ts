import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptDto } from './dto/receipt.dto';
import { ReceiptResponseDto } from './dto/receipt.response.dto';
import { ReceiptUpdateDto } from './dto/receipt.update.dto';
import { ReceiptParamsDto } from './dto/receipt.params.dto';
import { TABLE_NAMES } from '@src/db/const-tables';

@ApiBearerAuth()
@ApiTags(TABLE_NAMES.receipt)
@Controller(TABLE_NAMES.receipt)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  // temporarily disabled
  // @Delete('/uuid/:uuid')
  // async deleteReceiptByUuid(@Param() receiptParamsDto: ReceiptParamsDto) {
  //   return await this.receiptService.deleteReceipt(receiptParamsDto);
  // }

  // @Get('/')
  // async getAllReceipts() {
  //   return { data: 'test' };
  // }

  @Get('/uuid/:uuid')
  async getReceiptsByUuid(@Param() receiptParamsDto: ReceiptParamsDto) {
    return await this.receiptService.getReceiptByUuid(receiptParamsDto);
  }

  //TODO implement check that if type = 1, then returnUuid is blank, and if type = 2, than returnUuid not blank

  @Post('/')
  async createReceipt(@Body() receiptDto: ReceiptDto) {
    return await this.receiptService.createReceipt(receiptDto);
  }

  // this method is disabled because the check should not change
  // @Put('/uuid/:uuid')
  // async updateReceiptByUuid(
  //   @Param() receiptParamsDto: ReceiptParamsDto,
  //   @Body() receiptUpdateDto: ReceiptUpdateDto,
  // ) {
  //   return await this.receiptService.updateReceiptByUuid(
  //     receiptParamsDto,
  //     receiptUpdateDto,
  //   );
  // }
}
