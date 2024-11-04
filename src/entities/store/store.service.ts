import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Store } from './store.entity';
import { StoreDto } from './dto/store.dto';
import { StoreUpdateDto } from './dto/store-update.dto';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  public async getAllStores(): Promise<ResponseWrapperDto<StoreResponseDto>> {
    const result = await this.storeRepository.find();

    return this.getFormattedResults(result);
  }

  public async getStoreByUuid(
    uuid: string,
  ): Promise<ResponseWrapperDto<StoreResponseDto>> {
    const resultFind = await this.fetchStoreByUuid(uuid);

    const result = resultFind ? [resultFind] : [];

    return this.getFormattedResults(result);
  }

  public async createStore(
    storeDto: StoreDto,
  ): Promise<ResponseWrapperDto<StoreResponseDto>> {
    await this.validateExistenceByUuid(storeDto.uuid);

    const newStore = this.storeRepository.create(storeDto);

    const resultSave = await this.storeRepository.save(newStore);

    const result = resultSave ? [resultSave] : [];

    return this.getFormattedResults(result);
  }

  public async updateStoreByUuid(
    uuid: string,
    storeUpdateDto: StoreUpdateDto,
  ): Promise<ResponseWrapperDto<StoreResponseDto>> {
    const resultUpdate = await this.storeRepository.update(
      { uuid },
      storeUpdateDto,
    );

    const result = [];

    if (resultUpdate.affected === 1) {
      result.push(await this.fetchStoreByUuid(uuid));
    }

    return this.getFormattedResults(result);
  }

  private getFormattedResults(
    data: StoreResponseDto[],
  ): ResponseWrapperDto<StoreResponseDto> {
    const storeResponseDtos = plainToInstance(StoreResponseDto, data);

    return new ResponseWrapperDto(storeResponseDtos);
  }

  private async validateExistenceByUuid(uuid: string): Promise<void> {
    const store = await this.fetchStoreByUuid(uuid);
    if (store) {
      //TODO Add text error to messages in get.message.ts
      throw new ConflictException(`Record with UUID ${uuid} already exists.`);
    }
  }

  private async fetchStoreByUuid(uuid: string) {
    return await this.storeRepository.findOneBy({ uuid });
  }
}
