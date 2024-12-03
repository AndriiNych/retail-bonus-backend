import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterSaving } from './register-saving.entity';
import { RegisterSavingService } from './register-saving.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterSaving])],
  providers: [RegisterSavingService],
})
export class RegisterSavingModule {}
