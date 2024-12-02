import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Worker } from './worker.entity';
import { WorkerDto } from './dto/worker.dto';
import { WorkerResponseDto } from './dto/worker-response.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { WorkerParamsDto } from './dto/worker-params.dto';
import { WorkerUpdateDto } from './dto/worker-update.dto';
import { WorkerQueryParamsDto } from './dto/worker-query-params.dto';
import { TABLES } from '@src/db/const-tables';

const COLUMN_ID = 'id';
const COLUMN_UUID = 'uuid';
const COLUMN_STORE_UUID = 'store_uuid';
const COLUMN_NAME = 'name';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}

  public async createWorker(
    workerDto: WorkerDto,
  ): Promise<ResponseWrapperDto<WorkerResponseDto>> {
    await this.validateExistenceByUuid(workerDto.uuid);

    const newWorker = this.workerRepository.create(workerDto);

    const resultSave = await this.workerRepository.save(newWorker);

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, WorkerResponseDto);
  }

  public async getAllWorkers(
    workerQueryParamsDto: WorkerQueryParamsDto,
  ): Promise<ResponseWrapperDto<WorkerResponseDto>> {
    const query = this.getQueryByCriterial(workerQueryParamsDto);

    const result = await query.getMany();

    return responseWrapper(result, WorkerResponseDto);
  }

  public async updateWorkerByUuid(
    workerParamsDto: WorkerParamsDto,
    workerUpdateDto: WorkerUpdateDto,
  ): Promise<ResponseWrapperDto<WorkerResponseDto>> {
    const { uuid } = workerParamsDto;
    const resultUpdate = await this.workerRepository.update(
      { uuid },
      workerUpdateDto,
    );

    const result = [];
    if (resultUpdate.affected === 1) {
      result.push(await this.workerRepository.findOneBy({ uuid }));
    }

    return responseWrapper(result, WorkerResponseDto);
  }

  private getQueryByCriterial(
    workerQueryParamsDto: WorkerQueryParamsDto,
  ): SelectQueryBuilder<Worker> {
    const { id, uuid, storeUuid, name } = workerQueryParamsDto;

    const query = this.workerRepository.createQueryBuilder(TABLES.worker);

    if (id) {
      query.andWhere(`${TABLES.worker}.${COLUMN_ID} = :${COLUMN_ID}`, { id });
    }

    if (uuid) {
      query.andWhere(`${TABLES.worker}.${COLUMN_UUID} = :${COLUMN_UUID}`, {
        uuid,
      });
    }

    if (storeUuid) {
      query.andWhere(
        `${TABLES.worker}.${COLUMN_STORE_UUID} = :${COLUMN_STORE_UUID}`,
        { store_uuid: storeUuid },
      );
    }

    if (name) {
      query.andWhere(`${TABLES.worker}.${COLUMN_NAME} LIKE :${COLUMN_NAME}`, {
        name: `%${name}%`,
      });
    }

    return query;
  }

  private async validateExistenceByUuid(uuid: string): Promise<void> {
    const worker = await this.workerRepository.findOneBy({ uuid });
    if (worker) {
      throw new ConflictException(`Record with uuid ${uuid} already exists`);
    }
  }
}
