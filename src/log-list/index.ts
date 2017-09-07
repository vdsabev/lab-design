import './style.scss';

import { div, h4 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { Component } from 'mithril';

import { Log } from '../log';

export const LogList: Component<HTMLDivElement & { logs: Log[] }, null> = {
  view: ({ attrs: { logs } }) => (
    div({ class: 'container' }, logs.map(LogItem))
  )
};

const LogItem = (log: Log) => (
  div({ class: 'log-list-item mb-md pb-md' }, [
    h4(log.id),
    log.description,
    Timeago(new Date(<number>log.date))
  ])
);
