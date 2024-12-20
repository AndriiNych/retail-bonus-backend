import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class CustomerQueryParamsDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updated_at?: Date;
}
