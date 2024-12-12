import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DailyTasksQueryBaseDto {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date?: any;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  customerId?: number;

  @IsOptional()
  @IsBoolean()
  all?: boolean;
}
