import { Module } from '@nestjs/common';
import { TypeOrmModule as MySqlTypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MySqlTypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      connectTimeout: 30000,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class TypeOrmModule {}
