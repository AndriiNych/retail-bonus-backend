import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 250,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  phone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  email: string;

  @Column({
    name: 'amount_bonus',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  })
  amountBonus: string;

  @Column({
    name: 'amount_box',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  })
  amountBox: string;
  //TODO set the default value for bonuses using a constant
  @Column({
    name: 'bonus_percent',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  })
  bonusPercent: string;

  @Column({
    name: 'pay_percent',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  })
  payPercent: string;

  @Column({
    name: 'count_day',
    type: 'int',
    nullable: true,
    default: 0,
  })
  countDay: number;

  //TODO change name to updated_at
  @Column({
    name: 'date_change',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateChange: Date;
}
