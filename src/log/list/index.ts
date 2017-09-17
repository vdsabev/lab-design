import './style.scss';

import { div, h4 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { Component } from 'mithril';

import { Log } from '../index';

interface Attrs extends Partial<HTMLDivElement> {
  logs: Log[];
}

export const LogList: Component<Attrs, null> = {
  view: ({ attrs: { logs } }) => (
    div({ class: 'container' }, logs.map(LogItem))
  )
};

const LogItem = (log: Log) => (
  div({ class: 'log-list-item mb-md pb-md' }, [
    h4(log.id),
    log.text,
    Object.keys(log.indicators || {}).map((indicatorId) => div(`${indicatorId}: ${log.indicators[indicatorId]}`)),
    Timeago(new Date(log.date))
  ])
);
