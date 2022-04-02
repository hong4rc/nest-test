import { temperatureList, TemperatureType } from '../../metric/metric.service';

export interface TemperatureInput {
  temperature: number;
  date: Date;
  unit: TemperatureType;
}

export const isValidTemperatureDto = (
  temperatureInputDto: TemperatureInput,
): boolean => {
  temperatureInputDto.date = new Date(temperatureInputDto.date);
  return (
    typeof temperatureInputDto.temperature === 'number' &&
    temperatureInputDto.date instanceof Date &&
    temperatureList.includes(temperatureInputDto.unit)
  );
};
