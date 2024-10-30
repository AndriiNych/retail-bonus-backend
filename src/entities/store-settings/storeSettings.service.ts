import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { StoreSettings } from './storeSettings.entity';
import { StoreSettingsDto } from './dto/storeSettings.dto';
import { Store } from '../store/store.entity';
import { StoreSettingsUpdateDto } from './dto/storeSettings-update.dto';

const TABLE_NAME = 'store)settings';
const COLUMN_STORE_ID = 'store_id';
const COLUMN_START_DATE = 'start_date';
const COLUMN_END_DATE = 'end_date';
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
    const store = await this.getStoreSettings(storeSettingsDto);

    return await this.storeSettingsRepository.save(store);
  }

  public async getStoreSettingsById(id: number): Promise<StoreSettings> {
    const result = await this.storeSettingsRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException(`StoreSettings with Id: ${id} not found.`);
    }
    return result;
  }

  public async getStoreSettingsByCriterial(
    queryParams: Record<string, string>,
  ): Promise<StoreSettings[]> {
    const { uuid, ...criterial } = queryParams;

    if (uuid) {
      const storeId = await this.getStoreIdByUuid(uuid);
      criterial.store_id = String(storeId);
    }

    const query = this.getQueryByCriterial(criterial);

    return await query.getMany();
  }

  public async deleteStoreSettingsById(id: number) {
    return await this.storeSettingsRepository.delete({ id });
  }

  public async updateStoreSettingsById(
    id: number,
    storeSettingsUpdateDto: StoreSettingsUpdateDto,
  ): Promise<UpdateResult> {
    const store = await this.getStoreSettings(storeSettingsUpdateDto);

    return await this.storeSettingsRepository.update({ id }, store);
  }

  private async getStoreSettings(storeSettingsDto: StoreSettingsUpdateDto) {
    const storeId = await this.getStoreIdByUuid(storeSettingsDto.uuid);

    const store = this.storeSettingsRepository.create(storeSettingsDto);

    if (storeId) {
      store.storeId = storeId;
    }

    return store;
  }

  private getQueryByCriterial(criterial: Record<string, string>) {
    const { store_id, start_date, end_date } = criterial;

    const query = this.storeSettingsRepository.createQueryBuilder(TABLE_NAME);

    if (store_id) {
      query.andWhere(`${TABLE_NAME}.${COLUMN_STORE_ID} = :${COLUMN_STORE_ID}`, {
        store_id,
      });
    }

    if (start_date) {
      query.andWhere(
        `${TABLE_NAME}.${COLUMN_START_DATE} = :${COLUMN_START_DATE}`,
        {
          start_date,
        },
      );
    }

    if (end_date) {
      query.andWhere(`${TABLE_NAME}.${COLUMN_END_DATE} = :${COLUMN_END_DATE}`, {
        end_date,
      });
    }

    return query;
  }

  private async getStoreIdByUuid(uuid: string) {
    const store = await this.storeRepository.findOneBy({ uuid });

    if (!store) {
      throw new NotFoundException(`Store with UUID: ${uuid} not found.`);
    }

    return store.id;
  }
}
