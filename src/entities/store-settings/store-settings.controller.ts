import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';

import { StoreSettingsService } from './store-settings.service';
import { StoreSettingsDto } from './dto/store-settings.dto';
import { StoreSettingsParamsDto } from './dto/store-settings-params.dto';
import { StoreSettingsUpdateDto } from './dto/store-settings-update.dto';

@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  //TODO create validate queryParams from Dto in controller
  //uuid, start_date, end_date
  @Get('/')
  async getStoreSettingsByCriterial(@Query() query: Record<string, string>) {
    return await this.storeSettingsService.getStoreSettingsByCriterial(query);
  }

  @Get('/:id')
  async getStoreSettingsById(@Param() params: StoreSettingsParamsDto) {
    return await this.storeSettingsService.getStoreSettingsById(params.id);
  }

  @Post('/')
  async createStoreSettings(@Body() storeSettings: StoreSettingsDto) {
    return await this.storeSettingsService.createStoreSettings(storeSettings);
  }

  @Delete('/:id')
  async deleteStoreSettings(@Param() params: StoreSettingsParamsDto) {
    return await this.storeSettingsService.deleteStoreSettingsById(params.id);
  }

  @Put('/:id')
  async updateStoreSettings(
    @Param() params: StoreSettingsParamsDto,
    @Body() storeSettings: StoreSettingsUpdateDto,
  ) {
    return await this.storeSettingsService.updateStoreSettingsById(
      params.id,
      storeSettings,
    );
  }
}
