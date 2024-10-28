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

    const newStoreSettings =
      this.storeSettingsRepository.create(storeSettingsDto);
    newStoreSettings.storeId = store.id;
    console.log(newStoreSettings);
    return await this.storeSettingsRepository.save(newStoreSettings);
  }

  //store_uuid, start_date, end_date, date & operator=[lt, gt]
  public async getStoreSettingsByCriterial(
    queryParams: Record<string, string>,
  ): Promise<StoreSettings[]> {
    //TODO insert validate on error uuid and undefined
    const { uuid, start_date, end_date, date, operator } = queryParams;
    const { id: storeId } = await this.storeRepository.findOneBy({ uuid });

    console.log(queryParams);
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
      query.andWhere('store_settings.start_date <= :end_date', { end_date });
    }
    if (date) {
      if (!operator) {
        //   query.andWhere('store_settings.start_date >= :start_date', {
        //     start_date,
        //   });
        //   query.andWhere('store_settings.start_date <= :end_date', { end_date });
        // }
        query.andWhere('store_settings.start_date  = :date', { date });
      } else {
        query.andWhere(
          `store_settings.start_date ${operator === 'lt' ? '<=' : '>='} :date`,
          { date },
        );
      }
    }

    return await query.getMany();
  }
}
