import { PickType } from '@nestjs/mapped-types';
import { CustomerDto } from './customer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApiClassProperties } from '@src/utils/api-class-properties.decorator';

@ApiClassProperties()
export class CustomerParamsDto extends PickType(CustomerDto, [
  'phone',
] as const) {}
