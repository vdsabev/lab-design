import './LogList.scss';

import { Timeago } from 'compote/components/timeago';
import { Log } from './index';

export const LogList: FnComponent<{ logs: Log[] }> = () => ({
  view: ({ attrs: { logs } }) =>
    <div class="container">{logs.map(LogItem)}</div>
});

const LogItem = (log: Log) =>
  <div class="log-list-item mb-md pb-md">
    <h4>{log.id}</h4>
    {log.text}
    {Object.keys(log.indicators || {}).map((indicatorId) =>
      <div>{indicatorId}: {log.indicators[indicatorId]}</div>
    )}
    {Timeago(new Date(log.date))}
  </div>
;
