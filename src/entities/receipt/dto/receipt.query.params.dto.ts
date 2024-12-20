import { FIELDS_LENGTH } from '@src/db/const-fields';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ReceiptQueryParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(FIELDS_LENGTH.UUID)
  StoreUuid: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endtDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  limit: number;
}
