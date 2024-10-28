import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';

import { StoreSettingsService } from './storeSettings.service';
import { StoreSettingsDto } from './dto/storeSettings.dto';

@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  //TODO create dto validation
  @Get('/')
  @HttpCode(200)
  async getStoreSettingsByCriterial(@Query() query: Record<string, string>) {
    return await this.storeSettingsService.getStoreSettingsByCriterial(query);
  }

  @Post('/')
  async createStoreSettings(@Body() storeSettings: StoreSettingsDto) {
    return await this.storeSettingsService.createStoreSettings(storeSettings);
  }
}
