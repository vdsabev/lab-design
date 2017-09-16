import { Reference } from '../reference';

export * from './list';

import * as Services from './services';
export const IndicatorServices = Services;

export interface Indicator {
  id: string;

  name: string;
  unit: string;
  value: number;
  reference: Reference;
}
