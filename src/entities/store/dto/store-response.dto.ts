import { Expose } from 'class-transformer';

export class StoreResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  deltaBox: string;

  @Expose()
  isDeleted: boolean;
}
