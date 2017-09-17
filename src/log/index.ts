export * from './list';

import * as Services from './services';
export const LogServices = Services;

export interface Log {
  id: string;

  date: number;
  text: string;
  indicators: Record<string, number>;
}
