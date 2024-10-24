import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class StoreUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  uuid?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
