import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { StoreService } from './store.service';
import { StoreDto } from './dto/store.dto';
import { StoreUpdateDto } from './dto/store.update.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/')
  @HttpCode(200)
  async getAllStores() {
    const stores = await this.storeService.getAllStores();
    return { status: 'ok', data: stores };
  }

  @Get('/:uuid')
  //TODO check whether the use is necessary @HttpCode(200) and clear that
  @HttpCode(200)
  async getStoreByUuid(@Param('uuid') uuid: string) {
    const store = await this.storeService.getStoreByUuid(uuid);
    return { status: 'ok', data: store };
  }

  @Post('/')
  async createStore(@Body() store: StoreDto) {
    return await this.storeService.createStore(store);
  }

  @Put('/:uuid')
  async updateStore(
    @Param('uuid') uuid: string,
    @Body() store: StoreUpdateDto,
  ) {
    return await this.storeService.updateStoreByUuid(uuid, store);
  }
}
