import { PickType } from '@nestjs/swagger';
import { WorkerDto } from './worker.dto';

export class WorkerParamsDto extends PickType(WorkerDto, ['uuid'] as const) {}
