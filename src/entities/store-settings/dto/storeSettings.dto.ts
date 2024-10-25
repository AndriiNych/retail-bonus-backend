import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  Matches,
  ValidateIf,
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
  @ValidateIf(o => parseFloat(o.currentBonus) <= 100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'startBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  startBonus: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'currentBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  @ValidateIf(o => parseFloat(o.currentBonus) <= 100)
  currentBonus?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'bonusPayment must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  @ValidateIf(o => parseFloat(o.currentBonus) <= 100)
  bonusPayment?: string;
}
