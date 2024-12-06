import { ApiClassProperties } from '@src/utils/api-class-properties.decorator';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

@ApiClassProperties()
export class DailyTasksQueryDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsOptional()
  @IsBoolean()
  all?: boolean;
}
