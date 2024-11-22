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
import { StoreSettingsCurrentQueryParamsDto } from './dto/store-settings-current-query-params.dto';

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

  public async getStoreSettingsCurrentByUuid(
    storeSettingsCurrentQueryParamsDto: StoreSettingsCurrentQueryParamsDto,
  ): Promise<ResponseWrapperDto<StoreSettingsResponseDto>> {
    const queryParams = this.getQueryParams(storeSettingsCurrentQueryParamsDto);

    const result = await this.getStoreSettingsCurrent(queryParams);

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

    const storeSettings = await this.storeSettingsRepository.findOneBy({ id });
    //TODO make this implementation such as delete's function in receiptService
    const result = [];

    if (storeSettings) {
      await this.storeSettingsRepository.delete({ id });
      result.push(storeSettings);
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

  private async getStoreSettingsCurrent(queryParams): Promise<StoreSettings[]> {
    const { storeUuid, date: targetDate } = queryParams;

    let { maxDate } = await this.storeSettingsRepository
      .createQueryBuilder('store_settings')
      .select('MAX(store_settings.start_date)', 'maxDate')
      .where(
        'store_settings.store_uuid = :storeUuid AND store_settings.start_date <= :targetDate',
        { storeUuid, targetDate },
      )
      .getRawOne();

    if (!maxDate) {
      maxDate = process.env.START_DATE;
    }

    const result = await this.storeSettingsRepository
      .createQueryBuilder('store_settings')
      .where(
        'store_settings.store_uuid = :storeUuid AND store_settings.start_date >= :lastDate',
        { storeUuid, lastDate: maxDate },
      )
      .orderBy('store_settings.start_date')
      .getMany();

    return result;
  }

  private getQueryParams(
    storeSettingsCurrentQueryParamsDto: StoreSettingsCurrentQueryParamsDto,
  ) {
    const { storeUuid, date: dateQuery } = storeSettingsCurrentQueryParamsDto;

    const date = dateQuery ? dateQuery : new Date();

    return { storeUuid, date };
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
