import { plainToInstance } from 'class-transformer';
import { ResponseWrapperDto } from './dto/response-wrapper.dto';

export function responseWrapper<T>(
  data: T[],
  dtoClass: new (...args: any[]) => T,
): ResponseWrapperDto<T> {
  if (data) {
    console.log('err');
  }

  const responseDtos = plainToInstance(dtoClass, data);

  return new ResponseWrapperDto(responseDtos);
}
