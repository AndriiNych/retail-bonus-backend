import { Expose } from 'class-transformer';

export class StoreResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  isDeleted: boolean;
}
