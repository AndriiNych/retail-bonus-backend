import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BONUS } from '@src/utils/bonus';

@Entity('store_settings')
export class StoreSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    name: 'store_uuid',
    type: 'varchar',
    length: 40,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  storeUuid: string;

  @Column({
    name: 'start_date',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({
    name: 'start_bonus',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: BONUS.start,
    collation: 'utf8_general_ci',
  })
  startBonus: string;

  @Column({
    name: 'current_bonus',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: BONUS.current,
    collation: 'utf8_general_ci',
  })
  currentBonus: string;

  @Column({
    name: 'bonus_payment',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: BONUS.payment,
    collation: 'utf8_general_ci',
  })
  bonusPayment: string;
}
