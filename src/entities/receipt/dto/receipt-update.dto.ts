import { PartialType } from '@nestjs/mapped-types';
import { ReceiptDto } from './receipt.dto';

export class ReceiptUpdateDto extends PartialType(ReceiptDto) {}
