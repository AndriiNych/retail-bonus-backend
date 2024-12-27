import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PromoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  notes: string;
}
