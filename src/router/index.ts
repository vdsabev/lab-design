export * from './utils';

import * as m from 'mithril';

import { NotFound } from '../pages';
import { LogList } from '../log';
import { Login } from '../login';
import { ProfileDetails } from '../profile';
import { ReportDetails, ReportList } from '../report';
import { Timeline } from '../timeline';

import { pipeline, loadWith, ifLoggedInRedirectTo, getUserId, getProfile, queryLogs, queryReports, getReport } from './pipelines';
import { redirectTo, load } from './utils';

export type RouteParams = Record<string, string>;

export const route = m.route;

export function initializeRouter() {
  route.prefix('');

  const content = document.querySelector('#content');
  const loading = loadWith(content);
  const authorize = getUserId('userId');

  route(content, '/', {
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
