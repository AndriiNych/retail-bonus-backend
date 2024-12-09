import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterBalansQueryDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate?: Date;

  @IsOptional()
  @IsString()
  all?: string;
}
