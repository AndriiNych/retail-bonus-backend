import { OmitType } from '@nestjs/mapped-types';
import { ReceiptResponseBaseDto } from './receipt.response.base.dto';
import { Expose } from 'class-transformer';

export class TransformReceiptToRegisterBaseDto extends OmitType(ReceiptResponseBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
  'totalAmount',
] as const) {
  @Expose({ name: 'uuid' })
  documentUuid: string;

  @Expose({ name: 'returnUuid' })
  documentReturnUuid: string;
}
