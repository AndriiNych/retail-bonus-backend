import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreSettings } from './storeSettings.entity';
import { StoreSettingsController } from './storeSettings.controller';
import { StoreSettingsService } from './storeSettings.service';
import { Store } from '../store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreSettings])],
  controllers: [StoreSettingsController],
  providers: [StoreSettingsService],
})
export class StoreSettingsModule {}
