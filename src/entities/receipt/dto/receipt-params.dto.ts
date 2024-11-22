import { PickType } from '@nestjs/swagger';
import { ReceiptDto } from './receipt.dto';

export class ReceiptParamsDto extends PickType(ReceiptDto, ['uuid'] as const) {}
