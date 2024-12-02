import { Controller, Get, HttpCode } from '@nestjs/common';

import { ActiveService } from './active.service';
import { TABLES } from '@src/db/const-tables';

@Controller(TABLES.active)
export class ActiveController {
  constructor(private readonly activeService: ActiveService) {}

  @Get('/')
  async getAllActive() {
    const actives = await this.activeService.getAllActive();
    return { status: 'ok', data: actives };
  }
}
