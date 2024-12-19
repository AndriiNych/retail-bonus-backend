import { PickType } from '@nestjs/mapped-types';
import { TransformReceiptToRegisterBaseDto } from '@src/entities/receipt/dto/receipt-trnasfor.dto';
import { Expose } from 'class-transformer';

export class TransformToRegisterSavingBaseDto extends PickType(TransformReceiptToRegisterBaseDto, [
  'documentUuid',
  'customerId',
  'startDate',
  'saving',
]) {
  @Expose({ name: 'saving' })
  amount: string;
}
