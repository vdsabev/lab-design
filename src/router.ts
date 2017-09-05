import * as m from 'mithril';

import { NotFound } from './404-not-found';
import { Home } from './home';
import { ReportDetails } from './report-details';

import * as notify from './notify';
import { ReportServices } from './report';

type RouteParams = Record<string, string>;

export function initializeRouter() {
  m.route.prefix('');

  const content = document.querySelector('#content');
  m.route(content, '/', {
    '/': Home,
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

const render = (component: m.FactoryComponent<any> | m.Component<any, any>, ...args: any[]) => () => m(component, ...args);
