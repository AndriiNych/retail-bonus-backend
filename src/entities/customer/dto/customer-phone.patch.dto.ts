import { PickType } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';

export class CustomerPhonePatchDto extends PickType(CustomerDto, ['phone']) {}
