import { Body, Controller, Post } from '@nestjs/common';
import { PromoService } from './promo.service';
import { TABLE_NAMES } from '@src/db/const-tables';
import { PromoDto } from './dto/promo.dto';

@Controller(TABLE_NAMES.promo)
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post('/')
  async createPromo(@Body() promoDto: PromoDto) {
    return await this.promoService.cretatePromo(promoDto);
  }
}
