import { Expose } from 'class-transformer';

export class ResponseWrapperDto<T> {
  @Expose()
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
