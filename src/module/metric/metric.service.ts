import { Injectable } from '@nestjs/common';

export type DistanceType = 'Meter' | 'Centimeter' | 'Inch' | 'Feet' | 'Yard';

const distanceConversion: Record<DistanceType, number> = {
  Meter: 1,
  Centimeter: 100,
  Inch: 39.37,
  Feet: 3.28,
  Yard: 1.09,
};

export const distanceList: DistanceType[] = Object.keys(
  distanceConversion,
) as DistanceType[];

export type TemperatureType = 'Celsius' | 'Fahrenheit' | 'Kenvin';

const temperatureConversion: Record<TemperatureType, number> = {
  Celsius: 1,
  Fahrenheit: 1,
  Kenvin: 1,
};

export const temperatureList = Object.keys(
  temperatureConversion,
) as TemperatureType[];

export type TimeLongType = 'OneMonth' | 'TwoMonth' | 'SixMonth' | 'OneYear';

export const timeLongValue: Record<TimeLongType, number> = {
  OneMonth: 1,
  TwoMonth: 2,
  SixMonth: 6,
  OneYear: 12,
};

const timeLongList = Object.keys(timeLongValue) as TimeLongType[];

const deltaKenvin = 273.15;
const convertFahrenheit = {
  ratio: 1.8,
  delta: 32,
};

@Injectable()
export class MetricService {
  getListDistance(): DistanceType[] {
    return distanceList;
  }

  isValidDistanceType(unit: DistanceType): boolean {
    return distanceList.includes(unit);
  }

  isValidTemperatureType(unit: TemperatureType): boolean {
    return temperatureList.includes(unit);
  }

  isValidTimeLongType(time: TimeLongType) {
    return timeLongList.includes(time);
  }

  convertDistance(
    distance: number,
    to: DistanceType,
    from: DistanceType = 'Meter',
  ): number {
    return (distance * distanceConversion[from]) / distanceConversion[to];
  }

  getListTemperature(): TemperatureType[] {
    return temperatureList;
  }

  convertTemperature(
    temperature: number, // in Celsius
    to: TemperatureType,
  ): number {
    switch (to) {
      case 'Celsius':
        return temperature;
      case 'Fahrenheit':
        return temperature * convertFahrenheit.ratio + convertFahrenheit.delta;
      case 'Kenvin':
        return temperature + deltaKenvin;
      default:
        throw new Error(`Unknown temperature: ${to}`);
    }
  }

  convertTemperatureToCelsius(
    temperature: number, // in from
    from: TemperatureType,
  ): number {
    switch (from) {
      case 'Celsius':
        return temperature;
      case 'Fahrenheit':
        return (
          (temperature - convertFahrenheit.delta) / convertFahrenheit.ratio
        );
      case 'Kenvin':
        return temperature - deltaKenvin;
      default:
        throw new Error(`Unknown temperature: ${from}`);
    }
  }

  getListTimeLong(): TimeLongType[] {
    return timeLongList;
  }

  getMonth(timeLong: TimeLongType): number {
    return timeLongValue[timeLong];
  }
}
