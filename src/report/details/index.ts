import { div, h1 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import * as m from 'mithril';

import { Report } from '../index';
import { ValueIndicator, IndicatorList } from '../../indicator';

interface Attrs extends Partial<HTMLDivElement> {
  report: Report;
}

export const ReportDetails: m.Component<Attrs, null> = {
  view: ({ attrs: { report } }) => (
    div({ class: 'container fade-in-animation' }, [
      h1({ class: 'mb-md' }, report.id),
      div({ class: 'mb-md' }, report.text),
      div({ class: 'mb-lg' }, [
        Timeago(new Date(report.date))
      ]),
      m(IndicatorList, { indicators: toValueIndicators(report.indicators) })
    ])
  )
};

const toValueIndicators = (reportIndicators: Record<string, number>): Record<string, ValueIndicator> =>
  Object.keys(reportIndicators).reduce((indicators, indicatorId) => ({
    ...indicators,
    [indicatorId]: { value: reportIndicators[indicatorId] }
  }), {})
;
