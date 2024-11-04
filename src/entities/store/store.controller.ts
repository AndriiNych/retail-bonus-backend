import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { StoreService } from './store.service';
import { StoreDto } from './dto/store.dto';
import { StoreUpdateDto } from './dto/store-update.dto';
import { getResultObjectWithData } from '@src/utils/getResultObjectWithData';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/')
  async getAllStores() {
    return await this.storeService.getAllStores();
  }

  @Get('/:uuid')
  async getStoreByUuid(@Param('uuid') uuid: string) {
    return await this.storeService.getStoreByUuid(uuid);
  }

  @Post('/')
  async createStore(@Body() storeDto: StoreDto) {
    return await this.storeService.createStore(storeDto);
  }

  @Put('/:uuid')
  async updateStore(
    @Param('uuid') uuid: string,
    @Body() storeUpdateDto: StoreUpdateDto,
  ) {
    return await this.storeService.updateStoreByUuid(uuid, storeUpdateDto);
  }
}
