import { distanceList, DistanceType } from '../../metric/metric.service';

export interface DistanceInput {
  distance: number;
  date: Date;
  unit: DistanceType;
}

export const isValidDistanceDto = (distanceDto: DistanceInput): boolean => {
  distanceDto.date = new Date(distanceDto.date);
  return (
    typeof distanceDto.distance === 'number' &&
    distanceDto.distance > 0 &&
    distanceDto.date instanceof Date &&
    distanceList.includes(distanceDto.unit)
  );
};
