import { ApiClassProperties } from '@src/utils/api-class-properties.decorator';
import { FilterBaseDateDto } from '@src/utils/filters-query-dto/dto/filters.dto';
import { filterTransformDateDto } from '@src/utils/filters-query-dto/filterTransformObjectDto';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

@ApiClassProperties()
export class DailyTasksQueryDto {
  @IsOptional()
  @IsInt()
  activeType: number;

  @IsOptional()
  @IsInt()
  documentType?: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @ValidateNested()
  @Transform(({ value }) => {
    return Object.prototype.toString.call(value) === '[object Date]'
      ? value
      : filterTransformDateDto(value);
  })
  @Type(e => {
    const value = e.object?.[e.property];
    return typeof value === 'object' && value !== null ? FilterBaseDateDto : Date;
  })
  @IsOptional()
  startDate?: FilterBaseDateDto;

  @ValidateNested()
  @Transform(({ value }) => {
    return Object.prototype.toString.call(value) === '[object Date]'
      ? value
      : filterTransformDateDto(value);
  })
  @Type(e => {
    const value = e.object?.[e.property];
    return typeof value === 'object' && value !== null ? FilterBaseDateDto : Date;
  })
  @IsOptional()
  endDate?: FilterBaseDateDto | Date;

  @IsOptional()
  @IsBoolean()
  all?: boolean;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsObject()
  sort?: object;
}
