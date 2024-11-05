import { PickType } from '@nestjs/mapped-types';
import { CustomerDto } from './customer.dto';

export class CustomerParamsDto extends PickType(CustomerDto, [
  'phone',
] as const) {}
