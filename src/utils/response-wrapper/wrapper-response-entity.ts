import { plainToInstance } from 'class-transformer';

export function wrapperResponseEntity<T>(
  data: T[],
  dtoClass: new () => T,
  propertyName: string,
): Record<string, T[]> {
  const resultData = plainToInstance(dtoClass, data);

  return { [propertyName]: resultData };
}
