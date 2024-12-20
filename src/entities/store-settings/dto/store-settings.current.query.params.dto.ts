import { PickType } from '@nestjs/mapped-types';
import { StoreSettingsDto } from './store-settings.dto';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class StoreSettingsCurrentQueryParamsDto extends PickType(
  StoreSettingsDto,
  ['storeUuid'] as const,
) {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
