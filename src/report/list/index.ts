import { div, a, h4 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { Component, route } from 'mithril';

import { Report } from '../index';

interface Attrs extends Partial<HTMLDivElement> {
  reports: Report[];
}

export const ReportList: Component<Attrs, null> = {
  view: ({ attrs: { reports } }) => (
    div({ class: 'container' }, reports.map((report) =>
      a({ class: 'block mb-md', oncreate: route.link, href: `/reports/${report.id}` }, [
        h4(report.id),
        report.text,
        Timeago(new Date(report.date))
      ])
    ))
  )
};
