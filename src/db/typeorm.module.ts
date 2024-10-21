import { Module } from '@nestjs/common';
import { TypeOrmModule as MySqlTypeOrmModule } from '@nestjs/typeorm';
import { getBooleanValueFromEnv } from '@src/utils/env.boolean';

@Module({
  imports: [
    MySqlTypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ['dist/entities' + '/**/*.entity.js'],
      synchronize: getBooleanValueFromEnv(process.env.SINCHRONIZE),
    }),
  ],
})
export class TypeOrmModule {}
