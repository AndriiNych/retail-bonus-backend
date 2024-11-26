import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptProgress } from './receipt-progress.entity';
import { ReceiptProgressController } from './receipt-progress.controller';
import { ReceiptProgressService } from './receipt-progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptProgress])],
  controllers: [ReceiptProgressController],
  providers: [ReceiptProgressService],
})
export class ReceiptProgressModule {}
