import { Timeago } from 'compote/components/timeago';
import * as m from 'mithril';

import { ValueIndicator, IndicatorList } from '../indicator';
import { Report } from './index';

export const ReportDetails: FnComponent<{ report: Report }> = () => ({
  view: ({ attrs: { report } }) =>
    <div class="container fade-in-animation">
      <h1 class="mb-md">{report.id}</h1>
      <div class="mb-md">{report.text}</div>
      <div class="mb-lg">
        {Timeago(new Date(report.date))}
      </div>
      {m(IndicatorList, { indicators: toValueIndicators(report.indicators) })}
    </div>
});

const toValueIndicators = (reportIndicators: Record<string, number>): Record<string, ValueIndicator> =>
  Object.keys(reportIndicators).reduce((indicators, indicatorId) => ({
    ...indicators,
    [indicatorId]: { value: reportIndicators[indicatorId] }
  }), {})
;
