import { OmitType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { ReceiptResponseBaseDto } from './receipt.response.base.dto';

export class ReceiptResponseDto extends OmitType(ReceiptResponseBaseDto, ['customerId'] as const) {
  @Expose()
  customerPhone: string;
}
