import { FIELDS_LENGTH } from '@src/db/const-fields';
import { MSG } from '@src/utils/get.message';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterSavingDto {
  @IsNotEmpty()
  @IsString()
  @Length(FIELDS_LENGTH.UUID)
  documentUuid: string;

  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('totalAmount'),
  })
  amount: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;
}
