import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('receipts')
export class Customer {
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
    name: 'number_document',
    type: 'varchar',
    length: 250,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  })
  numberDocument: string;

  @Column({
    name: 'date_document',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateDocument: Date;

  @Index()
  @Column({
    name: 'store_id',
    type: 'int',
    nullable: false,
  })
  storeId: number;

  @Index()
  @Column({
    name: 'worker_id',
    type: 'int',
    nullable: false,
  })
  workerId: number;

  @Index()
  @Column({
    name: 'customer_id',
    type: 'int',
    nullable: false,
  })
  customerId: number;

  @Column({
    name: 'amount_document',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  })
  amountDocument: string;

  @Column({
    name: 'amount_action',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  })
  amountAction: string;

  @Column({
    name: 'start_date',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  endDate: Date;

  @Column({
    name: 'created_at',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
