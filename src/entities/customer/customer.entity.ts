import { FIELDS } from '@src/db/const-fields';
import { BONUS } from '@src/utils/bonus';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    ...FIELDS.TEXT_ROW,
    name: 'name',
  })
  name: string;

  @Column({
    ...FIELDS.PHONE,
    name: 'phone',
  })
  phone: string;

  @Column({
    ...FIELDS.EMAIL,
    name: 'email',
  })
  email: string;

  @Column({
    ...FIELDS.DECIMAL,
    name: 'amount_bonus',
  })
  amountBonus: string;

  @Column({
    ...FIELDS.DECIMAL,
    name: 'amount_box',
  })
  amountBox: string;

  @Column({
    ...FIELDS.PERCENT,
    name: 'bonus_percent',
    default: BONUS.start,
  })
  bonusPercent: string;

  @Column({
    ...FIELDS.PERCENT,
    name: 'pay_percent',
    default: BONUS.payment,
  })
  payPercent: string;

  @Column({
    name: 'count_day',
    type: 'int',
    nullable: true,
    default: BONUS.countDay,
  })
  countDay: number;

  @Column({
    ...FIELDS.CREATE_AT,
  })
  createdAt: Date;

  @Column({
    ...FIELDS.UPDATED_AT,
  })
  updatedAt: Date;
}
