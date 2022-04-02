import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricController } from './module/metric/metric.controller';
import { MetricService } from './module/metric/metric.service';
import { StatService } from './module/stat/stat.service';
import { StatController } from './module/stat/stat.controller';
import { StatModule } from './module/stat/stat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'dev.env',
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: +process.env.MYSQL_PORT || 3306,
        username: process.env.MYSQL_USERNAME || 'user1',
        password: process.env.MYSQL_PASSWORD || 'p4sswOrd',
        database: process.env.MYSQL_DATABASE || 'my_db',
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    StatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
