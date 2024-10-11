import { Controller, Get, HttpCode } from '@nestjs/common';

import { ActiveService } from './active.service';

@Controller('active')
export class ActiveController {
  constructor(private readonly activeService: ActiveService) {}

  @Get('/')
  @HttpCode(200)
  async getAllActive() {
    const actives = await this.activeService.getAllActive();
    return { status: 'ok', data: actives };
  }
}
