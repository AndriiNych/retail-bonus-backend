import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { StoreService } from './store.service';
import { StoreDto } from './dto/store.dto';
import { StoreUpdateDto } from './dto/store-update.dto';
import { StoreParams } from './dto/store-params.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/')
  async getAllStores() {
    return await this.storeService.getAllStores();
  }

  @Get('/:uuid')
  async getStoreByUuid(@Param() storeParams: StoreParams) {
    return await this.storeService.getStoreByUuid(storeParams);
  }

  @Post('/')
  async createStore(@Body() storeDto: StoreDto) {
    return await this.storeService.createStore(storeDto);
  }

  @Put('/:uuid')
  async updateStore(
    @Param() storeParams: StoreParams,
    @Body() storeUpdateDto: StoreUpdateDto,
  ) {
    return await this.storeService.updateStoreByUuid(
      storeParams,
      storeUpdateDto,
    );
  }
}
