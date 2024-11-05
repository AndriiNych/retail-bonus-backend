import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';

import { MSG } from '@src/utils/get.message';
import { IsSingleObject } from '@src/utils/dto/is-single-object.dto';

@IsSingleObject()
export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Matches(/^\d+$/, {
    message: MSG.ERR.VALIDATION.number('phone'),
  })
  @IsString()
  @Length(12)
  @IsNotEmpty()
  phone: string;

  @IsEmail({}, { message: MSG.ERR.VALIDATION.email('email') })
  @IsString()
  @IsOptional()
  email?: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: MSG.ERR.VALIDATION.decimal('amountBonus'),
  })
  @IsString()
  @IsOptional()
  amountBonus?: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: MSG.ERR.VALIDATION.decimal('amountBox'),
  })
  @IsString()
  @IsOptional()
  amountBox?: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: MSG.ERR.VALIDATION.decimal('bonusPercent'),
  })
  @IsString()
  @IsOptional()
  bonusPercent?: string;

  @Matches(/^\d+(\.\d{1,4})?$/, {
    message: MSG.ERR.VALIDATION.decimal('payPercent'),
  })
  @IsString()
  @IsOptional()
  payPercent?: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  countDay?: number;
}
