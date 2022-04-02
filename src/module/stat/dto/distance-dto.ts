import { DistanceType } from '../../metric/metric.service';

export interface DistanceDto {
  distance: number;
  date: string;
  unit: DistanceType;
}
