export * from './ReportDetails';
export * from './ReportList';
export * from './services';

export interface Report {
  id: string;

  date: number;
  text: string;
  indicators: Record<string, number>;
}
