import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Active } from './active.entity';
import { ActiveService } from './active.service';
import { ActiveController } from './active.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Active])],
  controllers: [ActiveController],
  providers: [ActiveService],
})
export class ActiveModule {}
