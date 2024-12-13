import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  imports: [],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
