import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { Receipt } from './receipt.entity';
import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), CustomerModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
