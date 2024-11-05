import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreSettings } from './store-settings.entity';
import { StoreSettingsController } from './store-settings.controller';
import { StoreSettingsService } from './store-settings.service';
import { Store } from '../store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreSettings])],
  controllers: [StoreSettingsController],
  providers: [StoreSettingsService],
})
export class StoreSettingsModule {}
