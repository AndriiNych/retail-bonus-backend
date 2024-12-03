import { FIELDS } from '@src/db/const-fields';
import { TABLES } from '@src/db/const-tables';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity(TABLES.register_saving)
export class RegisterSaving {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'document_uuid' })
  documentUuid: string;

  @Index()
  @Column({ ...FIELDS.NUMBER, name: 'customer_id' })
  customerId: number;

  @Column({ ...FIELDS.DECIMAL, name: 'amount' })
  amount: string;

  @Index()
  @Column({ ...FIELDS.DATE, name: 'start_date' })
  startDate: Date;

  @Column({ ...FIELDS.CREATE_AT })
  createdAt: Date;

  @Column({ ...FIELDS.UPDATED_AT })
  updatedAt: Date;
}
