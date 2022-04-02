import { TemperatureType } from '../../metric/metric.service';

export interface TemperatureDto {
  temperature: number;
  date: string;
  unit: TemperatureType;
}
