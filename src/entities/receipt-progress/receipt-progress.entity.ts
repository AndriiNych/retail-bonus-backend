import { FIELDS } from '@src/db/const-fields';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipts_progress')
export class ReceiptProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ ...FIELDS.NUMBER, name: 'type' })
  type: number;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'docUuid' })
  docUuid: string;

  @Index()
  @Column({ ...FIELDS.UUID, name: ' returnUuid' })
  returnUuid: string;

  @Column({ ...FIELDS.NUMBER, name: 'customer_id' })
  customerId: number;

  @Column({ ...FIELDS.DECIMAL, name: 'accured_bonus' })
  accuredBonus: string;

  @Index()
  @Column({ ...FIELDS.DATE, name: 'start_date' })
  startDate: Date;

  @Column({ ...FIELDS.CREATE_AT })
  createdAt: Date;
}
