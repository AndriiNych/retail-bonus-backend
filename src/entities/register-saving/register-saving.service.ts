import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterSaving } from './register-saving.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegisterSavingService {
  constructor(
    @InjectRepository(RegisterSaving)
    private readonly registerSavingRepository: Repository<RegisterSaving>,
  ) {}
}
