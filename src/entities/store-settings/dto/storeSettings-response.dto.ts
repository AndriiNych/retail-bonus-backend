import { Expose } from 'class-transformer';

export class StoreSettingsResponseDto {
  @Expose()
  id: number;

  @Expose()
  storeUuid: string;

  @Expose()
  startDate: Date;

  @Expose()
  startBonus: string;

  @Expose()
  currentBonus: string;

  @Expose()
  bonusPayment: string;
}
