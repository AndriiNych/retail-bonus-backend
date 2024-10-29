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
import { StoreSettingsParamsDto } from './dto/storeSettings-params.dto';
import { StoreSettingsUpdateDto } from './dto/storeSettings-update.dto';

@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  //TODO create validate queryParams from Dto in controller
  //uuid, start_date, end_date
  @Get('/')
  @HttpCode(200)
  async getStoreSettingsByCriterial(@Query() query: Record<string, string>) {
    return await this.storeSettingsService.getStoreSettingsByCriterial(query);
  }

  @Get('/:id')
  @HttpCode(200)
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
