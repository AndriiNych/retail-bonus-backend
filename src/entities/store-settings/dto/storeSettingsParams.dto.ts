import { IsInt, Min } from 'class-validator';

export class StoreSettingsParamsDto {
  @IsInt()
  @Min(1)
  id: number;
}
