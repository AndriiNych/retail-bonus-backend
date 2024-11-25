import { Expose } from 'class-transformer';

export class ReceiptResponseBaseDto {
  @Expose()
  id: number;

  @Expose()
  type: number;

  @Expose()
  uuid: string;

  @Expose()
  date: Date;

  @Expose()
  returnUuid: string;

  @Expose()
  totalAmount: string;

  @Expose()
  accruedBonus: string;

  @Expose()
  spentBonus: string;

  @Expose()
  saving: string;

  @Expose()
  storeUuid: string;

  @Expose()
  workerUuid: string;

  @Expose()
  customerId: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
