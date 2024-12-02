import { plainToInstance } from 'class-transformer';
import { ResponseWrapperDto } from './dto/response-wrapper.dto';

export function responseWrapper<T>(
  data: T[],
  dtoClass: new (...args: any[]) => T,
  // propertyName: string = 'data',
): ResponseWrapperDto<T> {
  // ): Record<string, T[]> {
  const responseDtos = plainToInstance(dtoClass, data);
  // const result = plainToInstance(dtoClass, data);

  return new ResponseWrapperDto(responseDtos);
  // return { [propertyName]: result };
}
