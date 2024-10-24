import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'uuid',
    type: 'varchar',
    length: 40,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  uuid: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  name: string;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
