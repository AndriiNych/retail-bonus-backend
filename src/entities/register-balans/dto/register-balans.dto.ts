import { FIELDS_LENGTH } from '@src/db/const-fields';
import { MSG } from '@src/utils/get.message';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterBalansDto {
  // 0 - feature records, 1 - active records, 99 - close records
  @IsNotEmpty()
  @IsIn([0, 1, 99])
  activeType: number;

  // 1 - receipt, 2 - receipt for return, 11 - add bonus, 12 - remove bonus, 22 spent bonus
  @IsNotEmpty()
  @IsIn([1, 2, 11, 12, 22])
  documentType: number;

  @IsString()
  @IsNotEmpty()
  @Length(FIELDS_LENGTH.UUID)
  documentUuid: string;

  @IsOptional()
  @IsString()
  @Length(FIELDS_LENGTH.UUID)
  documentReturnUuid: string;

  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('totalAmount'),
  })
  bonus: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
