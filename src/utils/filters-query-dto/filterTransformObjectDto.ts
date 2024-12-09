import { plainToInstance } from 'class-transformer';
import { FilterBaseDateDto, FilterBaseDto } from './dto/filters.dto';

export function filterTransformObjectDto(obj): FilterBaseDto {
  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (['gte', 'lte', 'equal'].includes(key)) {
      acc[key] = value;
      return acc;
    }

    acc['equal'] = key;
    return acc;
  }, {});
  return plainToInstance(FilterBaseDto, result);
}

//TODO magic-worlds ['gte', 'lte', 'equal', 'ne', 'lt', 'gt', 'in', 'like']
export function filterTransformDateDto(obj): FilterBaseDateDto {
  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (['gte', 'lte', 'equal', 'ne', 'lt', 'gt', 'in', 'like'].includes(key)) {
      acc[key] = value;
      return acc;
    }

    acc['equal'] = key;
    return acc;
  }, {});
  return plainToInstance(FilterBaseDateDto, result);
}
