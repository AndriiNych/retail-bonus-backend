import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  name: string;

  @Column({
    name: 'fullname',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  fullname: string;
}
