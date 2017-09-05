import * as Services from './services';
export const TestServices = Services;

export interface Test {
  id: string;

  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  value: number;
}
