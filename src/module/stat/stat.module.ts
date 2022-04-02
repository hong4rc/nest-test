import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Distance } from '../../model/distance';
import { Temperature } from '../../model/temperature';
import { User } from '../../model/user';
import { MetricController } from '../metric/metric.controller';
import { MetricService } from '../metric/metric.service';

import { StatController } from './stat.controller';
import { StatService } from './stat.service';

@Module({
  providers: [StatService, MetricService],
  controllers: [StatController, MetricController],
  imports: [SequelizeModule.forFeature([User, Distance, Temperature])],
})
export class StatModule {}
