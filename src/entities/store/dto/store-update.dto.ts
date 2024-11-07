import { OmitType, PartialType } from '@nestjs/mapped-types';
import { StoreDto } from './store.dto';

export class PrepareStoreUpdateDto extends OmitType(StoreDto, [
  'uuid',
] as const) {}

export class StoreUpdateDto extends PartialType(PrepareStoreUpdateDto) {}
