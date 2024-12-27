import { FIELDS } from '@src/db/const-fields';
import { TABLE_NAMES } from '@src/db/const-tables';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(TABLE_NAMES.promo)
export class Promo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ ...FIELDS.TEXT_ROW, name: 'name' })
  name: string;

  @Column({ ...FIELDS.EMAIL, name: 'email' })
  email: string;

  @Column({ ...FIELDS.TEXT_ROW, name: 'country' })
  country: string;

  @Column({ ...FIELDS.TEXT_ROW, name: 'phoneNUmber' })
  phoneNumber: string;

  @Column({ ...FIELDS.TEXT_ROW, name: 'notes' })
  notes: string;

  @Column({ ...FIELDS.CREATE_AT })
  createdAt: Date;
}
