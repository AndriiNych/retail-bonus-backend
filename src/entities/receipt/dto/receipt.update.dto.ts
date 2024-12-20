import { OmitType, PartialType } from '@nestjs/swagger';
import { ReceiptDto } from './receipt.dto';

export class PrepareReceiptUpdateDtp extends OmitType(ReceiptDto, ['uuid'] as const) {}

export class ReceiptUpdateDto extends PartialType(PrepareReceiptUpdateDtp) {}
