import { div, a, h4 } from 'compote/html';
import { Component, route } from 'mithril';

import { Report } from '../report';

export const ReportList: Component<Partial<HTMLDivElement> & { reports: Report[] }, null> = {
  view: ({ attrs: { reports } }) => (
    div({ class: 'container' }, reports.map((report) =>
      a({ oncreate: route.link, href: `/reports/${report.id}` }, [
        h4(report.id),
        report.description
      ])
    ))
  )
};
