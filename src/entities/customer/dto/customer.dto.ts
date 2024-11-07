import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsOptional,
  Matches,
  Length,
  MaxLength,
} from 'class-validator';

import { MSG } from '@src/utils/get.message';
import { IsSingleObject } from '@src/utils/dto/is-single-object.dto';
import { FIELDS_LENGTH } from '@src/db/const-fields';

@IsSingleObject()
export class CustomerDto {
  @IsString()
  @MaxLength(FIELDS_LENGTH.NAME)
  @IsNotEmpty()
  name?: string;

  @Matches(/^\d+$/, {
    message: MSG.ERR.VALIDATION.number('phone'),
  })
  @IsString()
  @Length(FIELDS_LENGTH.PHONE)
  @MaxLength(FIELDS_LENGTH.PHONE)
  @IsNotEmpty()
  phone: string;

  @IsEmail({}, { message: MSG.ERR.VALIDATION.email('email') })
  @MaxLength(FIELDS_LENGTH.EMAIL)
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
