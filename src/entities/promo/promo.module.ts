import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './promo.entity';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
