import { OmitType } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';

export class CustomerUpdateDto extends OmitType(CustomerDto, [
  'phone',
  'amountBonus',
  'amountBox',
] as const) {}
