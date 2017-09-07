import * as m from 'mithril';

import { Unauthorized } from './401-unauthorized';
import { NotFound } from './404-not-found';
import { LogList } from './log-list';
import { LoginForm } from './login';
import { ReportDetails } from './report-details';
import { ReportList } from './report-list';

import { initialUserAuth } from './auth';
import { LogServices } from './log';
import { ReportServices } from './report';
import { store } from './store';
import { isLoggedIn } from './user';

type RouteParams = Record<string, string>;

export function initializeRouter() {
  m.route.prefix('');

  const content = document.querySelector('#content');
  m.route(content, '/', {
    '/': redirect('/reports'),
    '/login': {
      render: requireAccess(isLoggedIn, redirect('/'), render(LoginForm))
    },
    '/logs': {
      async onmatch({ logId }: RouteParams) {
        try {
          const userId = await getCurrentUserId();
          return await LogServices.query(userId).then(load(LogList, 'logs'));
        }
        catch (error) {
          return Unauthorized;
        }
      }
    },
    '/reports': {
      async onmatch({ reportId }: RouteParams) {
        try {
          const userId = await getCurrentUserId();
          return await ReportServices.query(userId).then(load(ReportList, 'reports'));
        }
        catch (error) {
          return Unauthorized;
        }
      }
    },
    '/reports/:reportId': {
      async onmatch({ reportId }: RouteParams) {
        try {
          const userId = await getCurrentUserId();
          return await ReportServices.get(userId, reportId).then(load(ReportDetails, 'report'));
        }
        catch (error) {
          return Unauthorized;
        }
      }
    },
    '/:url': NotFound
  });
}

// TODO: Make sure this flow works when the user logs in / out repeatedly
const getCurrentUserId = async () => {
  await initialUserAuth;
  const { currentUser } = store.getState();
  if (!isLoggedIn(currentUser)) throw new Error('Unauthorized');
  return currentUser.auth.uid;
};

const load = <T>(component: m.FactoryComponent<any> | m.Component<any, any>, key = 'result') => (result: T) => (
  result ?
    { view: render(component, { [key]: result }) }
    :
    NotFound
);

const requireAccess = (accessFn: Function, whenTruthy: Function, whenFalsy: Function) => () => {
  const { currentUser } = store.getState();

  // Don't show the logged out state until the user is known to be either logged in or logged out
  if (!currentUser) return null;

  return accessFn(currentUser) ? whenTruthy() : whenFalsy();
};

const redirect = (url: string) => (): null => {
  m.route.set(url);
  return null;
};

const render = (component: m.FactoryComponent<any> | m.Component<any, any>, ...args: any[]) => () => m(component, ...args);
