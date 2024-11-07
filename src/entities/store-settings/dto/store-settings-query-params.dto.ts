import { PartialType, PickType } from '@nestjs/mapped-types';
import { StoreSettingsDto } from './store-settings.dto';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PrepareStoreSettingsQueryParamsDto extends PickType(
  StoreSettingsDto,
  ['storeUuid'] as const,
) {}

export class StoreSettingsQueryParamsDto extends PartialType(
  PrepareStoreSettingsQueryParamsDto,
) {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_date?: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_date?: Date;
}
