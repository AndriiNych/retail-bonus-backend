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
import { FIELDS_LENGTH, MAX_VALUE } from '@src/db/const-fields';
import { IsLessThanOrEqualTo } from '@src/utils/dto/is-less-than-or-equal.dto';
import { ApiCallbacks, ApiProperty } from '@nestjs/swagger';
import { ApiClassProperties } from '@src/utils/api-class-properties.decorator';

// @IsSingleObject()
@ApiClassProperties()
export class CustomerDto {
  // @ApiProperty({
  //   type: 'string',
  //   description: 'customer name',
  // })
  @IsString()
  @MaxLength(FIELDS_LENGTH.NAME)
  @IsNotEmpty()
  name: string;

  // @ApiProperty({
  //   type: 'string',
  //   description: 'customer phone number',
  // })
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

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('amountBonus'),
  })
  @IsString()
  @IsOptional()
  amountBonus?: string;

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('amountBox'),
  })
  @IsString()
  @IsOptional()
  amountBox?: string;

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('bonusPercent'),
  })
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @IsString()
  @IsOptional()
  bonusPercent?: string;

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('payPercent'),
  })
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @IsString()
  @IsOptional()
  payPercent?: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  countDay?: number;
}
