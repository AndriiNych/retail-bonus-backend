import { Module } from '@nestjs/common';
import { ConfigModule as MySqlConfigModule } from '@nestjs/config';

@Module({
  imports: [MySqlConfigModule.forRoot()],
})
export class ConfigModule {}
