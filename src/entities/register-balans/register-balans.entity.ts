import { FIELDS } from '@src/db/const-fields';
import { TABLE_NAMES } from '@src/db/const-tables';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity(TABLE_NAMES.register_balans)
export class RegisterBalans {
  @PrimaryGeneratedColumn()
  id: number;

  //TODO move activeType & documentType from ...service.ts to individual file and define types from there

  // 0 - feature records, 1 - active records, 99 - close records
  @Column({ ...FIELDS.NUMBER, name: 'active_type' })
  activeType: number;

  // 1 - receipt, 2 - receipt for return, 11 - add bonus, 12 - remove bonus, 22 spent bonus
  @Column({ ...FIELDS.NUMBER, name: 'document_type' })
  documentType: number;

  @Index()
  @Column({ ...FIELDS.UUID, name: 'document_uuid' })
  documentUuid: string;

  @Column({ ...FIELDS.UUID, name: 'document_return_uuid' })
  documentReturnUuid: string;

  @Column({ ...FIELDS.NUMBER, name: 'customer_id' })
  customerId: number;

  @Column({ ...FIELDS.DECIMAL, name: 'bonus' })
  bonus: string;

  @Column({ ...FIELDS.DECIMAL, name: 'used_bonus' })
  usedBonus: string;

  @Index()
  @Column({ ...FIELDS.DATE, name: 'start_date' })
  startDate: Date;

  @Index()
  @Column({ ...FIELDS.DATE, name: 'end_date' })
  endDate: Date;

  @Column({ ...FIELDS.CREATE_AT })
  createdAt: Date;

  @Column({ ...FIELDS.UPDATED_AT })
  updatedAt: Date;
}
