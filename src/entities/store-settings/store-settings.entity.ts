import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BONUS } from '@src/utils/bonus';
import { FIELDS } from '@src/db/const-fields';

@Entity('store_settings')
export class StoreSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    ...FIELDS.UUID,
    name: 'store_uuid',
  })
  storeUuid: string;

  @Column({
    ...FIELDS.DATE,
    name: 'start_date',
  })
  startDate: Date;

  @Column({
    ...FIELDS.PERCENT,
    name: 'start_bonus',
    default: BONUS.start,
  })
  startBonus: string;

  @Column({
    ...FIELDS.PERCENT,
    name: 'current_bonus',
    default: BONUS.current,
  })
  currentBonus: string;

  @Column({
    ...FIELDS.PERCENT,
    name: 'bonus_payment',
    default: BONUS.payment,
  })
  bonusPayment: string;
}
