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
import { StoreSettingsQueryParamsDto } from './dto/store-settings-query-params.dto';

@Controller('store-settings')
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Get('/')
  async getStoreSettingsByCriterial(
    @Query() storeSettingsQueryParamsDto: StoreSettingsQueryParamsDto,
  ) {
    return await this.storeSettingsService.getStoreSettingsByCriterial(
      storeSettingsQueryParamsDto,
    );
  }

  @Get('/:id')
  async getStoreSettingsById(
    @Param() storeSettingsParamsDto: StoreSettingsParamsDto,
  ) {
    return await this.storeSettingsService.getStoreSettingsById(
      storeSettingsParamsDto,
    );
  }

  @Post('/')
  async createStoreSettings(@Body() storeSettings: StoreSettingsDto) {
    return await this.storeSettingsService.createStoreSettings(storeSettings);
  }

  @Delete('/:id')
  async deleteStoreSettings(
    @Param() storeSettingsParamsDto: StoreSettingsParamsDto,
  ) {
    return await this.storeSettingsService.deleteStoreSettingsById(
      storeSettingsParamsDto,
    );
  }

  @Put('/:id')
  async updateStoreSettings(
    @Param() storeSettingsParamsDto: StoreSettingsParamsDto,
    @Body() storeSettingsUpdateDto: StoreSettingsUpdateDto,
  ) {
    return await this.storeSettingsService.updateStoreSettingsById(
      storeSettingsParamsDto,
      storeSettingsUpdateDto,
    );
  }
}
