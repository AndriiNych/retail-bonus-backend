import { Expose } from 'class-transformer';

export class Customer {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  numberDocument: string;

  @Expose()
  dateDocument: Date;

  @Expose()
  storeUuid: string;

  @Expose()
  workerUuid: string;

  @Expose()
  customerId: number;

  @Expose()
  amountDocument: string;

  @Expose()
  amountAction: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
