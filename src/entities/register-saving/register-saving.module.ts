import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterSaving } from './register-saving.entity';
import { RegisterSavingService } from './register-saving.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterSaving]), CustomerModule],
  providers: [RegisterSavingService],
  exports: [RegisterSavingService],
})
export class RegisterSavingModule {}
