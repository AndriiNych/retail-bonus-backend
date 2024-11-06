import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class WorkerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  uuid: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  storeUuid: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
