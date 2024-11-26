import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptProgress } from './receipt-progress.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiptProgressService {
  constructor(
    @InjectRepository(ReceiptProgress)
    private readonly receiptProgressRepository: Repository<ReceiptProgress>,
  ) {}
}
