import { Reference } from '../reference';

export * from './list';

import * as Services from './services';
export const IndicatorServices = Services;

export interface Indicator extends ValueIndicator {
  name: string;
  unit: string;
  reference: Reference;
}

export interface ValueIndicator {
  id: string;
  date: number;
  value: number;
}
