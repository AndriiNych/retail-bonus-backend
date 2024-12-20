import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ReceiptResponseBaseDto } from './receipt.response.base.dto';

export class ReceiptResponseDto extends OmitType(ReceiptResponseBaseDto, ['customerId'] as const) {
  @Expose()
  customerPhone: string;
}
