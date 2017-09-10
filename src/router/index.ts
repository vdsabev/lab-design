import * as m from 'mithril';

import { NotFound } from '../404-not-found';
import { Loading } from '../loading';
import { LogList } from '../log-list';
import { Login } from '../login';
import { ReportDetails } from '../report-details';
import { ReportList } from '../report-list';

import { pipeline, loadWith, ifLoggedInRedirectTo, authorize, queryLogs, queryReports, getReport } from './pipelines';
export { reloadRoute } from './pipelines';

export type RouteParams = Record<string, string>;

export type Component<A = any, S = any> = m.FactoryComponent<A> | m.Component<A, S>;

export function initializeRouter() {
  m.route.prefix('');

  const content = document.querySelector('#content');
  const loading = loadWith(content);

  m.route(content, '/', {
    '/': redirectTo('/reports'),
    '/login': {
      onmatch: pipeline([loading, ifLoggedInRedirectTo('/')], load(Login))
    },
    '/logs': {
      onmatch: pipeline([loading, authorize, queryLogs], load(LogList, 'logs'))
    },
    '/reports': {
      onmatch: pipeline([loading, authorize, queryReports], load(ReportList, 'reports'))
    },
    '/reports/:reportId': {
      onmatch: pipeline([loading, authorize, getReport], load(ReportDetails, 'report'))
    },
    '/:url': NotFound
  });
}

const redirectTo = (url: string) => () => {
  m.route.set(url);
  return Loading;
};

const load = <T>(component: Component, key?: keyof T) => (result?: T) => ({
  view: render(component, key != null && result != null ? { [key]: result[key] } : null)
});

const render = (component: Component, ...args: any[]) => () => m(component, ...args);
