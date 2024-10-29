import { PartialType } from '@nestjs/mapped-types';
import { StoreSettingsDto } from './storeSettings.dto';

export class StoreSettingsUpdateDto extends PartialType(StoreSettingsDto) {}
