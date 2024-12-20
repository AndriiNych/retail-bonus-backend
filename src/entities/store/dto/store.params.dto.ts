import { PickType } from '@nestjs/swagger';
import { StoreDto } from './store.dto';

export class StoreParams extends PickType(StoreDto, ['uuid'] as const) {}
