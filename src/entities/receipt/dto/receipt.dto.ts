import { FIELDS_LENGTH } from '@src/db/const-fields';
import { MSG } from '@src/utils/get.message';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class ReceiptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.UUID)
  uuid: string;

  @IsString()
  @MaxLength(FIELDS_LENGTH.NAME)
  @IsNotEmpty()
  numberDocument: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateDocument: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.UUID)
  storeUuid: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.UUID)
  workerUuid: string;

  @IsInt()
  @Min(1)
  customerId: number;

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('amountBox'),
  })
  @IsString()
  amountDocument: string;

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('amountBox'),
  })
  @IsString()
  amountAction: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
