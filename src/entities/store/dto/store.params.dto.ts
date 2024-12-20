import { PickType } from '@nestjs/mapped-types';
import { StoreDto } from './store.dto';

export class StoreParams extends PickType(StoreDto, ['uuid'] as const) {}
