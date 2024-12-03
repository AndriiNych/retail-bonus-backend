import { Expose } from 'class-transformer';

export class RegisterSavingResponseDto {
  @Expose()
  id: number;

  @Expose()
  documentUuid: string;

  @Expose()
  customerId: number;

  @Expose()
  amount: string;

  @Expose()
  startDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
