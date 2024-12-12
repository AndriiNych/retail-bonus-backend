import { PickType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CustomerDto } from './customer.dto';

export class CustomerUpdateBonusDto extends PickType(CustomerDto, ['amountBonus', 'amountBox']) {
  @IsInt()
  id: number;
}
