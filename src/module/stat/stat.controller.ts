import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { StatService } from './stat.service';
import {
  DistanceType,
  TemperatureType,
  TimeLongType,
} from '../metric/metric.service';
import { DistanceInput } from './dto/distance-input';
import { TemperatureInput } from './dto/temperature-input';
import { DistanceDto } from './dto/distance-dto';
import { TemperatureDto } from './dto/temperature-dto';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Post('/distance')
  addDistance(@Body() data: DistanceInput): Promise<DistanceDto> {
    return this.statService.addDistance(data);
  }

  @Post('/temperature')
  addTemperature(@Body() data: TemperatureInput): Promise<TemperatureDto> {
    return this.statService.addTemperature(data);
  }

  @Get('/distance')
  getAllDistance(
    @Query('unit') unit: DistanceType,
    @Query('time') time: TimeLongType,
  ): Promise<DistanceDto[]> {
    return this.statService.getAllDistance(unit, time);
  }

  @Get('/temperature')
  getTemperature(
    @Query('unit') unit: TemperatureType,
    @Query('time') time: TimeLongType,
  ): Promise<TemperatureDto[]> {
    return this.statService.getAllTemperature(unit, time);
  }
}
