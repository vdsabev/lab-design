import { Timeago } from 'compote/components/timeago';

import { route, Routes } from '../router';
import { Report } from './index';

export const ReportList: FnComponent<{ reports: Report[] }> = () => ({
  view: ({ attrs: { reports } }) =>
    <div class="container">
      {reports.map((report) =>
        <a class="block mb-md" oncreate={route.link} href={Routes.REPORT_DETAILS(report.id)}>
          <h4>{report.id}</h4>
          {report.text}
          {Timeago(new Date(report.date))}
        </a>
      )}
    </div>
});
