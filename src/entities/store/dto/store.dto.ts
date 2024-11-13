import { FIELDS_LENGTH } from '@src/db/const-fields';
import { MSG } from '@src/utils/get.message';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class StoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.UUID)
  uuid: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(FIELDS_LENGTH.NAME)
  name: string;

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: MSG.ERR.VALIDATION.decimal('deltaBox'),
  })
  @IsString()
  @IsOptional()
  deltaBox?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
