import { Body, Controller, Get, Param, Post, Put, Delete, Query } from '@nestjs/common';

import { StoreSettingsService } from './store-settings.service';
import { StoreSettingsDto } from './dto/store-settings.dto';
import { StoreSettingsParamsDto } from './dto/store-settings.params.dto';
import { StoreSettingsUpdateDto } from './dto/store-settings.update.dto';
import { StoreSettingsQueryParamsDto } from './dto/store-settings.query.params.dto';
import { StoreSettingsCurrentQueryParamsDto } from './dto/store-settings.current.query.params.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TABLE_NAMES } from '@src/db/const-tables';

@ApiBearerAuth()
@Controller(TABLE_NAMES.store_settings)
export class StoreSettingsController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Get('/')
  async getStoreSettingsByCriterial(
    @Query() storeSettingsQueryParamsDto: StoreSettingsQueryParamsDto,
  ) {
    return await this.storeSettingsService.getStoreSettingsByCriterial(storeSettingsQueryParamsDto);
  }

  @Get('current')
  async getStoreSettingsCurrentByUuid(
    @Query()
    storeSettingsCurrentQueryParamsDto: StoreSettingsCurrentQueryParamsDto,
  ) {
    return await this.storeSettingsService.getStoreSettingsCurrentByUuid(
      storeSettingsCurrentQueryParamsDto,
    );
  }

  @Get('current/:id')
  async getStoreSettingsById(@Param() storeSettingsParamsDto: StoreSettingsParamsDto) {
    return await this.storeSettingsService.getStoreSettingsById(storeSettingsParamsDto);
  }

  @Post('/')
  async createStoreSettings(@Body() storeSettings: StoreSettingsDto) {
    return await this.storeSettingsService.createStoreSettings(storeSettings);
  }

  @Delete('/:id')
  async deleteStoreSettings(@Param() storeSettingsParamsDto: StoreSettingsParamsDto) {
    return await this.storeSettingsService.deleteStoreSettingsById(storeSettingsParamsDto);
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
