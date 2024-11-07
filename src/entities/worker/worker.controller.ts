import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerDto } from './dto/worker.dto';
import { WorkerQueryParamsDto } from './dto/worker-query-params.dto';
import { WorkerParamsDto } from './dto/worker-params.dto';
import { WorkerUpdateDto } from './dto/worker-update.dto';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  // id, worker_uuid, store_uuid, name
  @Get('/')
  async getAllWorkers(@Query() workerQueryParamsDto: WorkerQueryParamsDto) {
    return await this.workerService.getAllWorkers(workerQueryParamsDto);
  }

  @Post()
  async createWorker(@Body() workerDto: WorkerDto) {
    return await this.workerService.createWorker(workerDto);
  }

  @Put(':uuid')
  async updateWorker(
    @Param() workerParamsDto: WorkerParamsDto,
    @Body() workerUpdateDto: WorkerUpdateDto,
  ) {
    return await this.workerService.updateWorkerByUuid(
      workerParamsDto,
      workerUpdateDto,
    );
  }
}
