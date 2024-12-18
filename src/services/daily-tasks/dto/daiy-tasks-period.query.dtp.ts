import { FilterBaseDateDto } from '@src/utils/filters-query-dto/dto/filters.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class DailyTasksPeriodQueryDto {
  @ValidateNested()
  @Type(e => {
    const value = e.object?.[e.property];
    return typeof value === 'object' && value !== null ? FilterBaseDateDto : Date;
  })
  date?: FilterBaseDateDto;
}
