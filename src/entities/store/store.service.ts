import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Store } from './store.entity';
import { StoreDto } from './dto/store.dto';
import { StoreUpdateDto } from './dto/store-update.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  public async getAllStores(): Promise<Store[]> {
    return await this.storeRepository.find();
  }

  public async getStoreByUuid(uuid: string): Promise<Store> {
    return await this.fetchStoreByUuid(uuid);
  }

  public async createStore(storeDto: StoreDto): Promise<Store> {
    await this.validateExistenceByUuid(storeDto.uuid);

    const newStore = this.storeRepository.create(storeDto);
    return await this.storeRepository.save(newStore);
  }

  public async updateStoreByUuid(
    uuid: string,
    storeDto: StoreUpdateDto,
  ): Promise<UpdateResult> {
    //TODO check this method
    if (storeDto.hasOwnProperty('uuid')) {
      await this.validateExistenceByUuid(uuid);
    }

    return await this.storeRepository.update({ uuid }, storeDto);
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
