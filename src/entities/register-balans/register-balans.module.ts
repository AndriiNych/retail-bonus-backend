import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterBalans } from './register-balans.entity';
import { RegisterBalansService } from './register-balans.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterBalans]), CustomerModule],
  providers: [RegisterBalansService],
  exports: [RegisterBalansService],
})
export class RegisterBalansModule {}
