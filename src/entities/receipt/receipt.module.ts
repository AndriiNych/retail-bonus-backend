import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './receipt.entity';
import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { CustomerModule } from '../customer/customer.module';
import { RegisterBalansModule } from '../register-balans/register-balans.module';
import { ReceiptRepository } from './receipt.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt]),
    CustomerModule,
    RegisterBalansModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService, ReceiptRepository],
})
export class ReceiptModule {}
