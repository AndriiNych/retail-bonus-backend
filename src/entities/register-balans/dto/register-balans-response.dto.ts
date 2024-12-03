import { Expose } from 'class-transformer';

export class RegisterBalansResponseDto {
  @Expose()
  id: number;

  @Expose()
  activeType: number;

  @Expose()
  documentType: number;

  @Expose()
  documentUuid: string;

  @Expose()
  documentReturnUuid: string;

  @Expose()
  customerId: number;

  @Expose()
  bonus: string;

  @Expose()
  usedBonus!: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
