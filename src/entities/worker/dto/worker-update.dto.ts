import { OmitType, PartialType } from '@nestjs/mapped-types';
import { WorkerDto } from './worker.dto';

export class PrepareWorkerUpdateDto extends OmitType(WorkerDto, [
  'uuid',
] as const) {}

export class WorkerUpdateDto extends PartialType(PrepareWorkerUpdateDto) {}
