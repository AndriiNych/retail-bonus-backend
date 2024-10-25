import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoreSettings } from './storeSettings.entity';
import { StoreSettingsDto } from './dto/storeSettings.dto';
import { Store } from '../store/store.entity';

@Injectable()
export class StoreSettingsService {
  constructor(
    @InjectRepository(StoreSettings)
    private readonly storeSettingsRepository: Repository<StoreSettings>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  public async createStoreSettings(
    storeSettingsDto: StoreSettingsDto,
  ): Promise<StoreSettings> {
    const { uuid } = storeSettingsDto;
    const store = await this.storeRepository.findOneBy({ uuid });

    if (!store) {
      throw new NotFoundException(`Store with UUID ${uuid} not found.`);
    }
    console.log('1');
    const newStoreSettings =
      this.storeSettingsRepository.create(storeSettingsDto);
    newStoreSettings.storeId = store.id;
    console.log(newStoreSettings);
    return await this.storeSettingsRepository.save(newStoreSettings);
  }
}
