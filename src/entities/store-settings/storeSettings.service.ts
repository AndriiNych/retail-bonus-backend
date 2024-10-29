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
    const storeId = await this.getStoreIdByUuid(storeSettingsDto.uuid);

    const newStoreSettings =
      this.storeSettingsRepository.create(storeSettingsDto);
    newStoreSettings.storeId = storeId;

    return await this.storeSettingsRepository.save(newStoreSettings);
  }

  //store_uuid, start_date, end_date
  public async getStoreSettingsByCriterial(
    queryParams: Record<string, string>,
  ): Promise<StoreSettings[]> {
    const { uuid, ...criterial } = queryParams;

    if (uuid) {
      const storeId = await this.getStoreIdByUuid(uuid);
      criterial.storeId = String(storeId);
    }

    const query = this.getQueryByCriterial(criterial);

    return await query.getMany();
  }

  private getQueryByCriterial(criterial) {
    const { storeId, start_date, end_date } = criterial;

    //TODO move "magic words"
    const query =
      this.storeSettingsRepository.createQueryBuilder('store_settings');

    if (storeId) {
      query.andWhere('store_settings.store_id = :storeId', { storeId });
    }

    if (start_date) {
      query.andWhere('store_settings.start_date >= :start_date', {
        start_date,
      });
    }

    if (end_date) {
      query.andWhere('store_settings.start_date <= :end_date', { end_date });
    }

    return query;
  }

  private async getStoreIdByUuid(uuid: string) {
    const store = await this.storeRepository.findOneBy({ uuid });

    if (!store) {
      throw new NotFoundException(`Store with UUID ${uuid} not found.`);
    }

    return store.id;
  }
}
