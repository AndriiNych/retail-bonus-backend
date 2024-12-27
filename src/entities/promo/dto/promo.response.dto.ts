import { Expose } from 'class-transformer';

export class PromoResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  country: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  notes: string;

  @Expose()
  createdAt: Date;
}
