import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { Receipt } from './receipt.entity';
import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt])],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
