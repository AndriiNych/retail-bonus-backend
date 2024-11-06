import { Expose } from 'class-transformer';

export class WorkerResponseDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  storeUuid: number;

  @Expose()
  name: string;

  @Expose()
  isDeleted: boolean;
}
