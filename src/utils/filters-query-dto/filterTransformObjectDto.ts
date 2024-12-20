import { plainToInstance } from 'class-transformer';
import { FilterBaseDateDto, FilterBaseDto } from './dto/filters.dto';
import { CONDITIONAL_STATEMENTS_EQUAL, CONDITIONAL_STATEMENTS } from './add-select-query_builder';

export function filterTransformObjectDto(obj): FilterBaseDto {
  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (CONDITIONAL_STATEMENTS.hasOwnProperty(key)) {
      acc[key] = value;
      return acc;
    }

    acc[CONDITIONAL_STATEMENTS_EQUAL] = key;
    return acc;
  }, {});
  return plainToInstance(FilterBaseDto, result);
}

export function filterTransformDateDto(obj): FilterBaseDateDto {
  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (CONDITIONAL_STATEMENTS.hasOwnProperty(key)) {
      acc[key] = value;
      return acc;
    }

    acc[CONDITIONAL_STATEMENTS_EQUAL] = key;
    return acc;
  }, {});
  return plainToInstance(FilterBaseDateDto, result);
}
