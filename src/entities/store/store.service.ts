import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Store } from './store.entity';
import { StoreDto } from './dto/store.dto';
import { StoreUpdateDto } from './dto/store.update.dto';
import { StoreResponseDto } from './dto/store.response.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { StoreParams } from './dto/store.params.dto';
import { MSG } from '@src/utils/get.message';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  public async getAllStores(): Promise<ResponseWrapperDto<StoreResponseDto>> {
    const result = await this.storeRepository.find();

    return responseWrapper(result, StoreResponseDto);
  }

  public async getStoreByUuid(
    storeParams: StoreParams,
  ): Promise<ResponseWrapperDto<StoreResponseDto>> {
    const { uuid } = storeParams;

    const resultFind = await this.fetchStoreByUuid(uuid);

    const result = resultFind ? [resultFind] : [];

    return responseWrapper(result, StoreResponseDto);
  }

  public async createStore(storeDto: StoreDto): Promise<ResponseWrapperDto<StoreResponseDto>> {
    await this.validateExistenceByUuid(storeDto.uuid);

    const newStore = this.storeRepository.create(storeDto);

    const resultSave = await this.storeRepository.save(newStore);

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, StoreResponseDto);
  }

  public async updateStoreByUuid(
    storeParams: StoreParams,
    storeUpdateDto: StoreUpdateDto,
  ): Promise<ResponseWrapperDto<StoreResponseDto>> {
    const { uuid } = storeParams;

    const resultUpdate = await this.storeRepository.update({ uuid }, storeUpdateDto);

    const result = [];

    if (resultUpdate.affected === 1) {
      result.push(await this.fetchStoreByUuid(uuid));
    }

    return responseWrapper(result, StoreResponseDto);
  }

  private async validateExistenceByUuid(uuid: string): Promise<void> {
    const store = await this.fetchStoreByUuid(uuid);
    if (store) {
      throw new ConflictException(MSG.ERR.MESSAGES.conflictException({ uuid }));
    }
  }

  private async fetchStoreByUuid(uuid: string) {
    return await this.storeRepository.findOneBy({ uuid });
  }
}
