import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PromoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  notes: string;
}
