import { Controller, Get } from '@nestjs/common';

import {
  DistanceType,
  MetricService,
  TemperatureType,
  TimeLongType,
} from './metric.service';

@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get('/distance')
  getListDistance(): DistanceType[] {
    return this.metricService.getListDistance();
  }

  @Get('/temperature')
  getListTemperature(): TemperatureType[] {
    return this.metricService.getListTemperature();
  }

  @Get('/time-long')
  getListTimeLong(): TimeLongType[] {
    return this.metricService.getListTimeLong();
  }
}
