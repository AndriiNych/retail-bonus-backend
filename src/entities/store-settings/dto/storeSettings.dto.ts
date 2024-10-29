import { IsLessThanOrEqualTo } from '@src/utils/dto/isLessThanOrEqual.dto';
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
  @MaxLength(36)
  uuid: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  //TODO change messages using constants

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'startBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  startBonus: string;

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'currentBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  currentBonus?: string;

  @IsOptional()
  @IsString()
  @IsLessThanOrEqualTo(100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'bonusPayment must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  bonusPayment?: string;
}
