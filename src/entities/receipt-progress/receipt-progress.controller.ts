import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptProgressService } from './receipt-progress.service';

@ApiBearerAuth()
@ApiTags('ReceiptsProgress')
@Controller('receipts-progress')
export class ReceiptProgressController {
  constructor(
    private readonly receiptProgressService: ReceiptProgressService,
  ) {}
}
