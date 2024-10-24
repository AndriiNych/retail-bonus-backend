import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Store } from '../store/store.entity';
import { BONUS } from '@src/utils/bonus';

@Entity('store_settings')
export class StoreSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    name: 'store_id',
    type: 'int',
    nullable: false,
  })
  storeId: number;

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
  StartBonus: string;

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

  @ManyToOne(() => Store, store => store.id)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
