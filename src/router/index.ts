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

export const Routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  PROFILE: '/profile',

  LOG_LIST: '/logs',

  REPORT_LIST: '/reports',
  REPORT_DETAILS: (reportId: string) => `/reports/${reportId}`,

  TIMELINE: '/timeline',

  OTHER: (url: string) => `/${url}`
};

export function initializeRouter() {
  route.prefix('');

  const content = document.querySelector('#content');
  const loading = loadWith(content);
  const authorize = getUserId('userId');

  route(content, Routes.HOME, {
    // Home
    [Routes.HOME]: redirectTo(Routes.REPORT_LIST),
    [Routes.LOGIN]: {
      onmatch: pipeline([loading, ifLoggedInRedirectTo(Routes.HOME)], load(Login))
    },
    [Routes.REGISTER]: {
      onmatch: pipeline([loading, ifLoggedInRedirectTo(Routes.HOME)], load(Register))
    },

    // Profile
    [Routes.PROFILE]: {
      onmatch: pipeline([loading, authorize, getProfile('profile')], load(ProfileDetails, 'profile'))
    },

    // Logs
    [Routes.LOG_LIST]: {
      onmatch: pipeline([loading, authorize, queryLogs('logs')], load(LogList, 'logs'))
    },

    // Reports
    [Routes.REPORT_LIST]: {
      onmatch: pipeline([loading, authorize, queryReports('reports')], load(ReportList, 'reports'))
    },
    [Routes.REPORT_DETAILS(':reportId')]: {
      onmatch: pipeline([loading, authorize, getReport('report')], load(ReportDetails, 'report'))
    },

    // Timeline
    [Routes.TIMELINE]: {
      onmatch: pipeline([loading, authorize], load(Timeline))
    },

    // Misc
    [Routes.OTHER(':url')]: NotFound
  });
}
