import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { MSG } from '@src/utils/get.message';
import { ApiProperty } from '@nestjs/swagger';

export class CustomersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray({ message: MSG.ERR.VALIDATION.array('customers') })
  @ValidateNested({ each: true })
  @Type(() => CustomerDto)
  customers: CustomerDto[];
}
