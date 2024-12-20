import { PickType } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';

export class CustomerParamsDto extends PickType(CustomerDto, ['phone'] as const) {}
