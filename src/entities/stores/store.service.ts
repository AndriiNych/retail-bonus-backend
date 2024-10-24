import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Store } from './store.entity';
import { StoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  public async getAllStores() {
    return await this.storeRepository.find();
  }

  public async getStoreByUuid(uuid: string) {
    return await this.fetchStoreByUuid(uuid);
  }

  public async createStore(storeDto: StoreDto): Promise<Store> {
    const storeInBase = await this.fetchStoreByUuid(storeDto.uuid);
    if (storeInBase) {
      throw new ConflictException(
        `Record with UUID ${storeDto} aready exists.`,
      );
    }

    const newStore = this.storeRepository.create(storeDto);
    return await this.storeRepository.save(newStore);
  }

  private async fetchStoreByUuid(uuid: string) {
    return await this.storeRepository.findOneBy({ uuid });
  }
}
