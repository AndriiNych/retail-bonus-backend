import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoreSettings } from './store-settings.entity';
import { StoreSettingsDto } from './dto/store-settings.dto';
import { StoreSettingsUpdateDto } from './dto/store-settings-update.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { StoreSettingsResponseDto } from './dto/store-settings-response.dto';
import { StoreSettingsParamsDto } from './dto/store-settings-params.dto';
import { StoreSettingsQueryParamsDto } from './dto/store-settings-query-params.dto';

const TABLE_NAME = 'store_settings';
const COLUMN_STORE_UUID = 'store_uuid';
const COLUMN_START_DATE = 'start_date';
const COLUMN_END_DATE = 'end_date';

@Injectable()
export class StoreSettingsService {
  constructor(
    @InjectRepository(StoreSettings)
    private readonly storeSettingsRepository: Repository<StoreSettings>,
  ) {}

  public async createStoreSettings(
    storeSettingsDto: StoreSettingsDto,
  ): Promise<ResponseWrapperDto<StoreSettingsResponseDto>> {
    const newStoreSettings =
      await this.storeSettingsRepository.create(storeSettingsDto);

    const resultSave =
      await this.storeSettingsRepository.save(newStoreSettings);

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, StoreSettingsResponseDto);
  }

  public async getStoreSettingsById(
    storeSettingsParamsDto: StoreSettingsParamsDto,
  ): Promise<ResponseWrapperDto<StoreSettingsResponseDto>> {
    const { id } = storeSettingsParamsDto;

    const resultSave = await this.storeSettingsRepository.findOneBy({ id });

    if (!resultSave) {
      throw new NotFoundException(`StoreSettings with Id: ${id} not found.`);
    }

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, StoreSettingsResponseDto);
  }

  public async getStoreSettingsByCriterial(
    storeSettingsQueryParamsDto: StoreSettingsQueryParamsDto,
  ): Promise<ResponseWrapperDto<StoreSettingsResponseDto>> {
    const query = this.getQueryByCriterial(storeSettingsQueryParamsDto);

    const result = await query.getMany();

    return responseWrapper(result, StoreSettingsResponseDto);
  }

  public async deleteStoreSettingsById(
    storeSettingsParamsDto: StoreSettingsParamsDto,
  ): Promise<ResponseWrapperDto<StoreSettingsDto>> {
    const { id } = storeSettingsParamsDto;

    const resultDeleted = await this.storeSettingsRepository.findOneBy({ id });

    const result = [];

    if (resultDeleted) {
      await this.storeSettingsRepository.delete({ id });
      result.push(resultDeleted);
    }

    return responseWrapper(result, StoreSettingsResponseDto);
  }

  public async updateStoreSettingsById(
    storeSettingsParamsDto: StoreSettingsParamsDto,
    storeSettingsUpdateDto: StoreSettingsUpdateDto,
  ): Promise<ResponseWrapperDto<StoreSettingsResponseDto>> {
    const { id } = storeSettingsParamsDto;

    const resultUpdate = await this.storeSettingsRepository.update(
      { id },
      storeSettingsUpdateDto,
    );

    const result = [];

    if (resultUpdate.affected === 1) {
      result.push(await this.storeSettingsRepository.findOneBy({ id }));
    }

    return responseWrapper(result, StoreSettingsResponseDto);
  }

  private getQueryByCriterial(
    storeSettingsQueryParamsDto: StoreSettingsQueryParamsDto,
  ) {
    const {
      storeUuid: store_uuid,
      start_date,
      end_date,
    } = storeSettingsQueryParamsDto;

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
        `${TABLE_NAME}.${COLUMN_START_DATE} >= :${COLUMN_START_DATE}`,
        {
          start_date,
        },
      );
    }

    if (end_date) {
      query.andWhere(
        `${TABLE_NAME}.${COLUMN_START_DATE} <= :${COLUMN_END_DATE}`,
        {
          end_date,
        },
      );
    }

    return query;
  }
}
