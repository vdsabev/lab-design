import * as m from 'mithril';

import { Unauthorized, NotFound } from '../pages';
import { Loading } from '../loading';

import { initialUserAuth } from '../auth';
import { isLoggedIn } from '../current-user';
import { Log, LogServices } from '../log';
import { notify } from '../alert';
import { Profile, ProfileServices } from '../profile';
import { Report, ReportServices } from '../report';
import { store } from '../store';

import { RouteParams } from './index';
import { load } from './utils';

interface PipelineStep {
  name: string;
  getState: (state?: PipelineState, params?: RouteParams) => Promise<PipelineState | void>;
  onError?: PipelineStepHandler;
}

interface PipelineStepHandler {
  (state?: PipelineState, params?: RouteParams): m.Component<any, any>;
}

type PipelineState = Record<string, any>;

export const loadWith = (el: Element): PipelineStep => ({
  name: 'loadWith',
  async getState(): Promise<void> {
    m.render(el, m(Loading));
  }
});

export const ifLoggedInRedirectTo = (url: string): PipelineStep => ({
  name: 'ifLoggedInRedirectTo',
  async getState(): Promise<void> {
    await initialUserAuth;
    const { currentUser } = store.getState();
    if (isLoggedIn(currentUser)) m.route.set(url);
  }
});

export const getUserId = (key: string): PipelineStep => ({
  name: 'getUserId',
  async getState(): Promise<Record<string, string>> {
    await initialUserAuth;
    const { currentUser } = store.getState();
    if (!isLoggedIn(currentUser)) throw new Error('Unauthorized');
    return { [key]: currentUser.auth.uid };
  },
  onError: load(Unauthorized)
});

export const getProfile = (key: string): PipelineStep => ({
  name: 'getProfile',
  async getState({ userId }): Promise<Record<string, Profile>> {
    const profile = await ProfileServices.getProfile({ userId });
    return { [key]: profile };
  },
  onError: load(NotFound) // TODO: Handle other errors
});

export const queryLogs = (key: string): PipelineStep => ({
  name: 'queryLogs',
  async getState({ userId }): Promise<Record<string, Log[]>> {
    const logs = await LogServices.query({ userId });
    return { [key]: logs };
  },
  onError: load(NotFound) // TODO: Handle other errors
});

export const queryReports = (key: string): PipelineStep => ({
  name: 'queryReports',
  async getState({ userId }): Promise<Record<string, Report[]>> {
    const reports = await ReportServices.query({ userId });
    return { [key]: reports };
  },
  onError: load(NotFound) // TODO: Handle other errors
});

export const getReport = (key: string): PipelineStep => ({
  name: 'getReport',
  async getState({ userId }, { reportId }): Promise<Record<string, Report>> {
    const report = await ReportServices.get({ userId, reportId });
    return { [key]: report };
  },
  onError: load(NotFound) // TODO: Handle other errors
});

export const pipeline = (steps: PipelineStep[], componentFn: PipelineStepHandler) => {
  if (steps.length === 0) throw new Error(`Pipeline must contain at least 1 element! ${JSON.stringify(steps, null, 2)}`);

  return async (params: RouteParams): Promise<m.Component<any, any>> => {
    let state: PipelineState = {};
    for (const step of steps) {
      try {
        const newState = await step.getState(state, params);
        if (newState) {
          state = { ...state, ...newState };
        }
      }
      catch (error) {
        notify.error(error);
        return step.onError(state, params);
      }
    }

    return componentFn(state, params);
  };
};
