import { PartialType } from '@nestjs/mapped-types';
import { ReceiptDto } from './receipt.dto';
import { OmitType } from '@nestjs/swagger';

export class PrepareReceiptUpdateDtp extends OmitType(ReceiptDto, [
  'uuid',
] as const) {}

export class ReceiptUpdateDto extends PartialType(PrepareReceiptUpdateDtp) {}
