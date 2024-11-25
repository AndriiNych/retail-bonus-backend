import { FIELDS_LENGTH, MAX_VALUE } from '@src/db/const-fields';
import { IsLessThanOrEqualTo } from '@src/utils/dto/is-less-than-or-equal.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  Matches,
  MaxLength,
} from 'class-validator';

export class StoreSettingsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.UUID)
  storeUuid: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  //TODO change messages using constants

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'startBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  startBonus: string;

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'currentBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  currentBonus?: string;

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'bonusPayment must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  bonusPayment?: string;
}
