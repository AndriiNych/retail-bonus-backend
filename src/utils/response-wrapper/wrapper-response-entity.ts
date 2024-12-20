import { plainToInstance } from 'class-transformer';

export function wrapperResponseEntity<T>(
  data: any,
  dtoClass: new () => T,
  propertyName: string,
): Record<string, T[]> {
  const transformData = !data ? [] : Array.isArray(data) ? data : [data];

  const resultData = plainToInstance(dtoClass, transformData, {
    excludeExtraneousValues: true,
  });

  return { [propertyName]: resultData };
}
