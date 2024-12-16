import { Controller, Get } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('settings')
@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('/')
  async getSettings() {
    return this.settingService.getSettings();
  }
}
