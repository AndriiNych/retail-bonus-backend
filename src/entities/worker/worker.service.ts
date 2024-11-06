import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Worker } from './worker.entity';
import { WorkerDto } from './dto/worker.dto';
import { WorkerResponseDto } from './dto/worker-response.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';

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

  private async validateExistenceByUuid(uuid: string): Promise<void> {
    const worker = await this.workerRepository.findOneBy({ uuid });
    if (worker) {
      throw new ConflictException(`Record with uuid ${uuid} already exists`);
    }
  }
}
