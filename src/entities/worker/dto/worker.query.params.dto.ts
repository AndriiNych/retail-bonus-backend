import { PickType, PartialType } from '@nestjs/swagger';
import { WorkerDto } from './worker.dto';
import { IsInt, Min } from 'class-validator';

export class PrepareWorkerQueryParamsDto extends PickType(WorkerDto, [
  'uuid',
  'storeUuid',
  'name',
] as const) {
  @IsInt()
  @Min(1)
  id: number;
}

export class WorkerQueryParamsDto extends PartialType(PrepareWorkerQueryParamsDto) {}
