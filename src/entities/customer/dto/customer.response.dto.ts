import { Expose } from 'class-transformer';

export class CustomerResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  amountBonus: string;

  @Expose()
  amountBox: string;

  @Expose()
  bonusPercent: string;

  @Expose()
  payPercent: string;

  @Expose()
  countDay: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
