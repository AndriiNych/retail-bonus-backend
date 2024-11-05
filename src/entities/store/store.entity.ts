import { FIELDS } from '@src/db/const-fields';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    ...FIELDS.UUID,
    name: 'uuid',
  })
  uuid: string;

  @Column({
    ...FIELDS.TEXT_ROW,
    name: 'name',
  })
  name: string;

  @Column({
    ...FIELDS.IS_DELETED,
  })
  isDeleted: boolean;
}
