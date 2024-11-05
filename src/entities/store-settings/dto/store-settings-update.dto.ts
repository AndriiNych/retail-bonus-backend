import { PartialType } from '@nestjs/mapped-types';
import { StoreSettingsDto } from './store-settings.dto';

export class StoreSettingsUpdateDto extends PartialType(StoreSettingsDto) {}
