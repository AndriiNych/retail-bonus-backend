import { Module } from '@nestjs/common';
import { TypeOrmModule as MySqlTypeOrmModule } from '@nestjs/typeorm';

console.log(`host: ${process.env.MYSQL_HOST} `);
console.log(`port: ${process.env.MYSQL_PORT} `);
console.log(`username: ${process.env.MYSQL_USERNAME} `);
console.log(`password: ${process.env.MYSQL_PASSWORD} `);
console.log(`database: ${process.env.MYSQL_DATABASE} `);

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
      synchronize: true,
    }),
  ],
})
export class TypeOrmModule {}
