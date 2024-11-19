import { FIELDS } from '@src/db/const-fields';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ ...FIELDS.NUMBER, name: 'type' })
  type: number;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'uuid' })
  uuid: string;

  @Column({ ...FIELDS.UPDATED_AT, name: 'date' })
  date: Date;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'return_uuid' })
  returnUuid: string;

  @Column({ ...FIELDS.DECIMAL, name: 'total_amount' })
  totalAmount: string;

  @Column({ ...FIELDS.DECIMAL, name: 'accured_bonus' })
  accruedBonus: string;

  @Column({ ...FIELDS.DECIMAL, name: 'spent_bonus' })
  spentBonus: string;

  @Column({ ...FIELDS.DECIMAL, name: 'saving' })
  saving: string;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'store_uuid' })
  storeUuid: string;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'worker_uuid' })
  workerUuid: string;

  @Index()
  @Column({ ...FIELDS.NUMBER, name: 'customer_id' })
  customerId: number;

  @Column({ ...FIELDS.DATE, name: 'start_date' })
  startDate: Date;

  @Column({ ...FIELDS.DATE, name: 'end_date' })
  endDate: Date;

  @Column({ ...FIELDS.CREATE_AT })
  createdAt: Date;

  @Column({ ...FIELDS.UPDATED_AT })
  updatedAt: Date;
}
