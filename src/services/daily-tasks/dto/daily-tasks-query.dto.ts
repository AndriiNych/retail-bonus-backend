import { ApiClassProperties } from '@src/utils/api-class-properties.decorator';
import { FilterBaseDateDto } from '@src/utils/filters-query-dto/dto/filters.dto';
import {
  filterTransformDateDto,
  filterTransformObjectDto,
} from '@src/utils/filters-query-dto/filterTransformObjectDto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@ApiClassProperties()
export class DailyTasksQueryDto {
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  activeType: number;

  @ValidateNested()
  @Transform(({ value }) => {
    return Object.prototype.toString.call(value) === '[object Date]'
      ? value
      : filterTransformDateDto(value);
  })
  @Type(e => {
    return typeof e.object[e.property] === 'object' ? FilterBaseDateDto : Date;
  })
  @IsOptional()
  @IsNotEmpty()
  startDate?: FilterBaseDateDto;

  @ValidateNested()
  @Transform(({ value }) => {
    return Object.prototype.toString.call(value) === '[object Date]'
      ? value
      : filterTransformDateDto(value);
  })
  @Type(e => {
    return typeof e.object[e.property] === 'object' ? FilterBaseDateDto : Date;
  })
  @IsOptional()
  @IsNotEmpty()
  endDate?: FilterBaseDateDto | Date;

  @IsOptional()
  @IsString()
  all?: string;
}
