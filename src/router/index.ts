import * as m from 'mithril';

import { NotFound } from '../pages';
import { Loading } from '../loading';
import { LogList } from '../log';
import { Login } from '../login';
import { ProfileDetails } from '../profile';
import { ReportDetails, ReportList } from '../report';
import { Timeline } from '../timeline';

import { pipeline, loadWith, ifLoggedInRedirectTo, getUserId, getProfile, queryLogs, queryReports, getReport } from './pipelines';

export type RouteParams = Record<string, string>;

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
      onmatch: pipeline([loading, authorize, getProfile('profile')], load(ProfileDetails, 'profile'))
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
    '/timeline': {
      onmatch: pipeline([loading, authorize], load(Timeline))
    },
    '/:url': NotFound
  });
}

export const reloadRoute = () => {
  m.route.set(window.location.href, undefined, { replace: true });
};

const redirectTo = (url: string) => () => {
  m.route.set(url);
  return { view: render(Loading) };
};

const load = <T>(component: FnComponent<any, any>, key?: keyof T) => (result?: T) => ({
  view: render(component, key != null && result != null ? { [key]: result[key] } : null)
});

const render = (component: FnComponent<any, any>, ...args: any[]) => () => m(component, ...args);
