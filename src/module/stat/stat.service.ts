import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../../model/user';
import { Distance } from '../../model/distance';
import { DistanceInput, isValidDistanceDto } from './dto/distance-input';
import {
  TemperatureInput,
  isValidTemperatureDto,
} from './dto/temperature-input';
import { DistanceDto } from './dto/distance-dto';
import {
  DistanceType,
  MetricService,
  TemperatureType,
  TimeLongType,
  timeLongValue,
} from '../metric/metric.service';
import { Op } from 'sequelize';
import { Temperature } from 'src/model/temperature';
import { TemperatureDto } from './dto/temperature-dto';

const wrapNumber = (num: number): string => (num < 10 ? `0${num}` : '' + num);
const convertDateString = (date: Date): string => {
  return `${date.getFullYear()}${wrapNumber(1 + date.getMonth())}${wrapNumber(
    date.getDate(),
  )}`;
};

@Injectable()
export class StatService {
  constructor(
    @InjectModel(Distance)
    private readonly distanceModel: typeof Distance,

    @InjectModel(Temperature)
    private readonly temperatureModel: typeof Temperature,
    private readonly metricService: MetricService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
  async addDistance(distanceDto: DistanceInput): Promise<DistanceDto> {
    if (!isValidDistanceDto(distanceDto)) {
      throw new BadRequestException('Invalid distance input');
    }
    const user = await this.getUser();

    const date = distanceDto.date;
    const dateString = convertDateString(date);

    // remove all old value
    await this.distanceModel.destroy({
      where: {
        creator_id: user.id,
        date: dateString,
      },
    });

    // init new value
    const newDistance = new Distance();
    newDistance.creator_id = user.id;
    newDistance.distance = this.metricService.convertDistance(
      distanceDto.distance,
      distanceDto.unit,
    );
    newDistance.date = dateString;
    await newDistance.save();
    return {
      date: newDistance.date,
      distance: newDistance.distance,
      unit: 'Meter',
    };
  }

  async addTemperature(
    temperatureInput: TemperatureInput,
  ): Promise<TemperatureDto> {
    if (!isValidTemperatureDto(temperatureInput)) {
      throw new BadRequestException('Invalid temperature input');
    }
    const user = await this.getUser();

    const date = temperatureInput.date;
    const dateString = convertDateString(date);

    // remove all old value
    await this.temperatureModel.destroy({
      where: {
        creator_id: user.id,
        date: dateString,
      },
    });

    // init new value
    const newTemperature = new Temperature();
    newTemperature.creator_id = user.id;
    newTemperature.temperature = this.metricService.convertTemperatureToCelsius(
      temperatureInput.temperature,
      temperatureInput.unit,
    );
    newTemperature.date = dateString;
    await newTemperature.save();
    return {
      date: newTemperature.date,
      temperature: newTemperature.temperature,
      unit: 'Celsius',
    };
  }

  async getAllDistance(
    unit: DistanceType = 'Meter',
    time: TimeLongType = 'OneMonth',
  ): Promise<DistanceDto[]> {
    if (!this.metricService.isValidDistanceType(unit)) {
      throw new BadRequestException('Invalid unit');
    }
    if (!this.metricService.isValidTimeLongType(time)) {
      throw new BadRequestException('Invalid time');
    }

    const user = await this.getUser();

    const now = new Date();
    const endDate = convertDateString(now);

    const deltaMonth: number = timeLongValue[time];
    now.setMonth(now.getMonth() - deltaMonth);

    const startDate = convertDateString(now);

    const distanceList = await this.distanceModel.findAll({
      where: {
        creator_id: user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
    });

    return distanceList.map((v) => {
      return {
        date: v.date,
        distance: this.metricService.convertDistance(v.distance, unit, 'Meter'),
        unit,
      };
    });
  }

  async getAllTemperature(
    unit: TemperatureType = 'Celsius',
    time: TimeLongType = 'OneMonth',
  ): Promise<TemperatureDto[]> {
    if (!this.metricService.isValidTemperatureType(unit)) {
      throw new BadRequestException('Invalid unit');
    }
    if (!this.metricService.isValidTimeLongType(time)) {
      throw new BadRequestException('Invalid time');
    }

    const user = await this.getUser();

    const now = new Date();
    const endDate = convertDateString(now);

    const deltaMonth: number = timeLongValue[time];
    now.setMonth(now.getMonth() - deltaMonth);

    const startDate = convertDateString(now);

    console.log('Query date:', startDate, '->', endDate);
    const temperatureList = await this.temperatureModel.findAll({
      where: {
        creator_id: user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
    });

    return temperatureList.map((v) => {
      return {
        date: v.date,
        temperature: this.metricService.convertTemperature(v.temperature, unit),
        unit,
      };
    });
  }

  async getUser(): Promise<User> {
    const user = await this.userModel.findOne();

    if (user) {
      return user;
    }

    const newUser = new User();
    newUser.userName = 'test_user';
    await newUser.save();
    return newUser;
  }
}
