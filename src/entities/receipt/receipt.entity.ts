import { FIELDS } from '@src/db/const-fields';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('receipts')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    ...FIELDS.UUID,
    name: 'uuid',
  })
  uuid: string;

  @Column({
    ...FIELDS.TEXT_ROW,
    name: 'number_document',
  })
  numberDocument: string;

  @Column({
    ...FIELDS.UPDATED_AT,
    name: 'date_document',
  })
  dateDocument: Date;

  @Index()
  @Column({
    ...FIELDS.UUID,
    name: 'store_uuid',
  })
  storeUuid: string;

  @Index()
  @Column({
    ...FIELDS.UUID,
    name: 'worker_uuid',
  })
  workerUuid: string;

  @Index()
  @Column({
    name: 'customer_id',
    type: 'int',
    nullable: false,
  })
  customerId: number;

  @Column({
    ...FIELDS.DECIMAL,
    name: 'amount_document',
  })
  amountDocument: string;

  @Column({
    ...FIELDS.DECIMAL,
    name: 'amount_action',
  })
  amountAction: string;

  @Column({
    ...FIELDS.DATE,
    name: 'start_date',
  })
  startDate: Date;

  @Column({
    ...FIELDS.DATE,
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    ...FIELDS.CREATE_AT,
  })
  createdAt: Date;

  @Column({
    ...FIELDS.UPDATED_AT,
  })
  updatedAt: Date;
}
