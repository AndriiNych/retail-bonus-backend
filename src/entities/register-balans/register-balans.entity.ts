import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('register_balans')
export class RegisterBalans {
  @PrimaryGeneratedColumn()
  id: number;

  // 0 - feature records, 1 - active records, 99 - close records
  activeType: number;

  // 1 - receipt, 2 - receipt for return, 11 - add bonus, 12 - remove bonus, 22 spent bonus
  documentType: number;

  documentUuid: string;
}
