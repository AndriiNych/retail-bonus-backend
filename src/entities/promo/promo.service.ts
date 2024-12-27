import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promo } from './promo.entity';
import { PromoDto } from './dto/promo.dto';
import { PromoResponseDto } from './dto/promo.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
  ) {}

  public async cretatePromo(promoDto: PromoDto): Promise<PromoResponseDto> {
    const newPromo = this.promoRepository.create(promoDto);

    const savedPromo = await this.promoRepository.save(newPromo);

    return plainToInstance(PromoResponseDto, savedPromo);
  }
}
