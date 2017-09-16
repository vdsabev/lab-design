import { div, h1 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import * as m from 'mithril';

import { Report } from '../index';
import { IndicatorList } from '../../indicator';

interface Attrs extends Partial<HTMLDivElement> {
  report: Report;
}

export const ReportDetails: m.Component<Attrs, null> = {
  view: ({ attrs: { report } }) => (
    div({ class: 'container fade-in-animation' }, [
      h1({ class: 'mb-md' }, report.id),
      div({ class: 'mb-md' }, report.text),
      div({ class: 'mb-lg' }, [
        Timeago(new Date(<number>report.date))
      ]),
      m(IndicatorList, { indicators: report.indicators })
    ])
  )
};
