import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Active } from './active.entity';

@Injectable()
export class ActiveService {
  constructor(
    @InjectRepository(Active)
    private readonly activeRepository: Repository<Active>,
  ) {}

  public async getAllActive(): Promise<Active[]> {
    return await this.activeRepository.find();
  }
}
