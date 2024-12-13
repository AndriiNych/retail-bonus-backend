import { IsInt } from 'class-validator';

export class DailyTasksParamsDto {
  @IsInt()
  customerId: number;
}
