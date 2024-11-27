import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterBalans } from './register-balans.entity';
import { RegisterBalansService } from './register-balans.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterBalans])],
  providers: [RegisterBalansService],
})
export class RegisterBalansModule {}
