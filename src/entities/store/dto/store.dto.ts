import { FIELDS_LENGTH } from '@src/db/const-fields';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
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

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
