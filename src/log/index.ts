import * as Services from './services';
export const LogServices = Services;

export interface Log {
  id: string;

  date: number | Object;
  description: string;
}
