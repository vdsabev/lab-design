import * as Services from './services';
export const LogServices = Services;

export interface Log {
  id: string;

  date: number | Object;
  text: string;
  indicators: Record<string, number>;
}
