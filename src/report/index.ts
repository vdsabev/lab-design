export * from './details';
export * from './list';

import * as Services from './services';
export const ReportServices = Services;

export interface Report {
  id: string;

  date: number | Object;
  text: string;
  indicators: Record<string, number>;
}
