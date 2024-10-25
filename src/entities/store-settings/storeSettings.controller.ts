import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';

import { StoreSettingsService } from './storeSettings.service';
import { StoreSettingsDto } from './dto/storeSettings.dto';

@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Get('/')
  @HttpCode(200)
  async getStoreSettings() {}

  @Post('/')
  async createStoreSettings(@Body() storeSettings: StoreSettingsDto) {
    return await this.storeSettingsService.createStoreSettings(storeSettings);
  }
}
