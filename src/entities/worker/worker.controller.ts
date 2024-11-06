import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerDto } from './dto/worker.dto';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  // id, worker_uuid, store_uuid, name
  @Get('/')
  async getAllWorkers() {}

  @Post()
  async createWorker(@Body() workerDto: WorkerDto) {}

  @Put(':uuid')
  async updateWorker(@Param() workerParamDto, @Body() workerUpdateDto) {}
}
