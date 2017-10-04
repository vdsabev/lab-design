export * from './utils';

import * as m from 'mithril';

import { LogList } from '../log';
import { Login } from '../login';
import { NotFound } from '../pages';
import { ProfileDetails } from '../profile';
import { Register } from '../register';
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
    // Home
    '/': redirectTo('/reports'),
    '/login': {
      onmatch: pipeline([loading, ifLoggedInRedirectTo('/')], load(Login))
    },
    '/register': {
      onmatch: pipeline([loading, ifLoggedInRedirectTo('/')], load(Register))
    },

    // Profile
    '/profile': {
      onmatch: pipeline([loading, authorize, getProfile('profile')], load(ProfileDetails, 'profile'))
    },

    // Logs
    '/logs': {
      onmatch: pipeline([loading, authorize, queryLogs('logs')], load(LogList, 'logs'))
    },

    // Reports
    '/reports': {
      onmatch: pipeline([loading, authorize, queryReports('reports')], load(ReportList, 'reports'))
    },
    '/reports/:reportId': {
      onmatch: pipeline([loading, authorize, getReport('report')], load(ReportDetails, 'report'))
    },

    // Timeline
    '/timeline': {
      onmatch: pipeline([loading, authorize], load(Timeline))
    },

    // Misc
    '/:url': NotFound
  });
}
