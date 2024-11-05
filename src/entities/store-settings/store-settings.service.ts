import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { StoreSettings } from './store-settings.entity';
import { StoreSettingsDto } from './dto/store-settings.dto';
import { Store } from '../store/store.entity';
import { StoreSettingsUpdateDto } from './dto/store-settings-update.dto';
import { StoreSettingsResponseDto } from './dto/store-settings-response.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';

const TABLE_NAME = 'store)settings';
const COLUMN_STORE_UUID = 'store_uuid';
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
  ): Promise<ResponseWrapperDto<StoreSettings>> {
    const store = await this.getStoreSettings(storeSettingsDto);

    const resultSave = await this.storeSettingsRepository.save(store);

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, StoreSettings);
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
    const query = this.getQueryByCriterial(queryParams);

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
    this.getStoreIdByUuid(storeSettingsDto.store_uuid);

    const storeSettings = this.storeSettingsRepository.create(storeSettingsDto);

    return storeSettings;
  }

  private getQueryByCriterial(criterial: Record<string, string>) {
    const { store_uuid, start_date, end_date } = criterial;

    const query = this.storeSettingsRepository.createQueryBuilder(TABLE_NAME);

    if (store_uuid) {
      query.andWhere(
        `${TABLE_NAME}.${COLUMN_STORE_UUID} = :${COLUMN_STORE_UUID}`,
        {
          store_uuid,
        },
      );
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
