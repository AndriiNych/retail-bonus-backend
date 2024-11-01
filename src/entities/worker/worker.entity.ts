import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('worker')
export class StoreSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    name: 'uuid',
    type: 'varchar',
    length: 40,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  uuid: string;

  @Index()
  @Column({
    name: 'store_uuid',
    type: 'varchar',
    length: 40,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  storeUuid: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 250,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  name: string;
}
