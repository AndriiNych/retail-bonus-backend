import { FIELDS_LENGTH } from '@src/db/const-fields';
import { MSG } from '@src/utils/get.message';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ReceiptDto {
  // value: 1 - receipt (check), value: 2 - refund receipt(check)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(2)
  type: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.UUID)
  uuid: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  //TODO implement check that if type = 1, then returnUuid is blank, and if type = 2, than returnUuid not blank
  @IsString()
  @MaxLength(FIELDS_LENGTH.UUID)
  returnUuid?: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('totalAmount'),
  })
  totalAmount: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('accruedBonus'),
  })
  accuredBonus: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('spentBonus'),
  })
  spentBonus: string;

  @IsString()
  @Matches(/^-?\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('saving'),
  })
  saving: string;

  @IsString()
  @MaxLength(FIELDS_LENGTH.UUID)
  @IsNotEmpty()
  storeUuid: string;

  @IsString()
  @MaxLength(FIELDS_LENGTH.UUID)
  @IsNotEmpty()
  workerUuid: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.PHONE)
  customerPhone: string;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
