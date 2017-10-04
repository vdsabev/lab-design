export * from './IndicatorList';
export * from './services';

import { Reference } from '../reference';

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
