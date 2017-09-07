import * as m from 'mithril';

import { NotFound } from './404-not-found';
import { LogList } from './log-list';
import { ReportDetails } from './report-details';
import { ReportList } from './report-list';

import { LogServices } from './log';
import { ReportServices } from './report';

import * as notify from './notify';

type RouteParams = Record<string, string>;

export function initializeRouter() {
  m.route.prefix('');

  const content = document.querySelector('#content');
  m.route(content, '/', {
    '/': redirect('/reports'),
    '/logs': {
      onmatch: ({ logId }: RouteParams) => LogServices.query().then(load(LogList, 'logs')).catch(notify.error)
    },
    '/reports': {
      onmatch: ({ reportId }: RouteParams) => ReportServices.query().then(load(ReportList, 'reports')).catch(notify.error)
    },
    '/reports/:reportId': {
      onmatch: ({ reportId }: RouteParams) => ReportServices.get(reportId).then(load(ReportDetails, 'report')).catch(notify.error)
    },
    '/:url': NotFound
  });
}

const load = <T>(component: m.FactoryComponent<any> | m.Component<any, any>, key = 'result') => (result: T) => (
  result ?
    { view: render(component, { [key]: result }) }
    :
    NotFound
);

const redirect = (url: string) => (): null => {
  m.route.set(url);
  return null;
};

const render = (component: m.FactoryComponent<any> | m.Component<any, any>, ...args: any[]) => () => m(component, ...args);
