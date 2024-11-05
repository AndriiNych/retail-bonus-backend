import { FIELDS } from '@src/db/const-fields';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('worker')
export class StoreSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    ...FIELDS.UUID,
    name: 'uuid',
  })
  uuid: string;

  @Index()
  @Column({
    ...FIELDS.UUID,
    name: 'store_uuid',
  })
  storeUuid: number;

  @Column({
    ...FIELDS.TEXT_ROW,
    name: 'name',
  })
  name: string;
}
