import { PickType } from '@nestjs/mapped-types';
import { WorkerDto } from './worker.dto';

export class WorkerParamsDto extends PickType(WorkerDto, ['uuid'] as const) {}
