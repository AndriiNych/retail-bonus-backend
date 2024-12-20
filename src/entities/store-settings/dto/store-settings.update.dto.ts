import { PartialType } from '@nestjs/swagger';
import { StoreSettingsDto } from './store-settings.dto';

export class StoreSettingsUpdateDto extends PartialType(StoreSettingsDto) {}
