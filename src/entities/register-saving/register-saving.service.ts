import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RegisterSaving } from './register-saving.entity';
import { EntityManager } from 'typeorm';
import { RegisterSavingDto } from './dto/register-saving.dto';
import { RegisterSavingResponseDto } from './dto/register-saving.response.dto';
import { ReceiptResponseBaseDto } from '../receipt/dto/receipt.response.base.dto';
import { plainToInstance } from 'class-transformer';
import { TransformToRegisterSavingBaseDto } from './dto/register-saving.transform.dto';
import { TABLE_NAMES } from '@src/db/const-tables';
import { configureSelectQueryBuilder } from '@src/utils/filters-query-dto/add-select-query_builder';

const TABLE_NAME = TABLE_NAMES.register_saving;
@Injectable()
export class RegisterSavingService {
  constructor() {}

  public async getAllRecords(
    manager: EntityManager,
    queryObj: any,
  ): Promise<RegisterSavingResponseDto[]> {
    const sqb = manager.createQueryBuilder(RegisterSaving, TABLE_NAME);

    configureSelectQueryBuilder(sqb, queryObj);

    try {
      return await sqb.getMany();
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  public async saveReceiptToRegisterSaving(
    manager: EntityManager,
    receiptResponseBaseDto: ReceiptResponseBaseDto,
  ): Promise<void> {
    const { saving } = receiptResponseBaseDto;

    if (!saving) return;

    const registerSavingDto = plainToInstance(
      TransformToRegisterSavingBaseDto,
      receiptResponseBaseDto,
      {
        strategy: 'excludeAll',
      },
    );
    const newRegisterSavingDto = { ...registerSavingDto, startDate: new Date() };

    await this.saveRegisterSaving(manager, newRegisterSavingDto);
  }

  public async saveRegisterSaving(
    manager: EntityManager,
    registerSavingDto: RegisterSavingDto,
  ): Promise<RegisterSavingResponseDto> {
    return await manager.save(RegisterSaving, registerSavingDto);
  }
}
