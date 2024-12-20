import { FIELDS_LENGTH, MAX_VALUE } from '@src/db/const-fields';
import { IsLessThanOrEqualTo } from '@src/utils/dto/is-less-than-or-equal.dto';
import { MSG } from '@src/utils/get.message';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate, Matches, MaxLength } from 'class-validator';

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
    message: MSG.ERR.VALIDATION.percent('startBonus'),
  })
  startBonus: string;

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.percent('currentBonus'),
  })
  currentBonus?: string;

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(MAX_VALUE.PERCENT)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.percent('bonusPayment'),
  })
  bonusPayment?: string;
}
