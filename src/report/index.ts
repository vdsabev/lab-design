import { Test } from '../test';

import * as Services from './services';
export const ReportServices = Services;

export interface Report {
  id: string;

  date: number | Object;
  description: string;
  tests: Record<string, Test>;
}
