import * as m from 'mithril';

import { NotFound } from '../404-not-found';
import { Loading } from '../loading';
import { LogList } from '../log-list';
import { Login } from '../login';
import { UserProfile } from '../user-profile';
import { ReportDetails } from '../report-details';
import { ReportList } from '../report-list';

import { pipeline, loadWith, ifLoggedInRedirectTo, getUserId, getUserProfile, queryLogs, queryReports, getReport } from './pipelines';

export type RouteParams = Record<string, string>;

export type Component<A = any, S = any> = m.FactoryComponent<A> | m.Component<A, S>;

export function initializeRouter() {
  m.route.prefix('');

  const content = document.querySelector('#content');
  const loading = loadWith(content);
  const authorize = getUserId('userId');

  m.route(content, '/', {
    '/': redirectTo('/reports'),
    '/login': {
      onmatch: pipeline([loading, ifLoggedInRedirectTo('/')], load(Login))
    },
    '/profile': {
      onmatch: pipeline([loading, authorize, getUserProfile('profile')], load(UserProfile, 'profile'))
    },
    '/logs': {
      onmatch: pipeline([loading, authorize, queryLogs('logs')], load(LogList, 'logs'))
    },
    '/reports': {
      onmatch: pipeline([loading, authorize, queryReports('reports')], load(ReportList, 'reports'))
    },
    '/reports/:reportId': {
      onmatch: pipeline([loading, authorize, getReport('report')], load(ReportDetails, 'report'))
    },
    '/:url': NotFound
  });
}

export const reloadRoute = () => {
  m.route.set(window.location.href, undefined, { replace: true });
};

const redirectTo = (url: string) => () => {
  m.route.set(url);
  return Loading;
};

const load = <T>(component: Component, key?: keyof T) => (result?: T) => ({
  view: render(component, key != null && result != null ? { [key]: result[key] } : null)
});

const render = (component: Component, ...args: any[]) => () => m(component, ...args);
