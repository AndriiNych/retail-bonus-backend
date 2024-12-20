import { OmitType } from '@nestjs/mapped-types';
import { CustomerDto } from './customer.dto';

export class CustomerUpdateDto extends OmitType(CustomerDto, [
  'phone',
  'amountBonus',
  'amountBox',
] as const) {}
