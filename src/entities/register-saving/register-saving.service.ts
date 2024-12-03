import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterSaving } from './register-saving.entity';
import { Repository } from 'typeorm';
import { RegisterSavingDto } from './dto/register-saving.dto';
import { RegisterSavingResponseDto } from './dto/register-saving-response.dto';

@Injectable()
export class RegisterSavingService {
  constructor(
    @InjectRepository(RegisterSaving)
    private readonly registerSavingRepository: Repository<RegisterSaving>,
  ) {}

  public async saveRegisterSaving(
    registerSavingDto: RegisterSavingDto,
  ): Promise<RegisterSavingResponseDto> {
    return await this.registerSavingRepository.save(registerSavingDto);
  }
}
