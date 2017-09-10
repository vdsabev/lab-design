import * as m from 'mithril';

import { Unauthorized } from '../401-unauthorized';
import { NotFound } from '../404-not-found';
import { Loading } from '../loading';

import { initialUserAuth } from '../auth';
import { Log, LogServices } from '../log';
import { Report, ReportServices } from '../report';
import { store } from '../store';
import { isLoggedIn } from '../user';

import { RouteParams, Component } from './index';

interface PipelineStep {
  getState: (state?: PipelineState, params?: RouteParams) => Promise<PipelineState | void>;
  onError?: PipelineStepHandler;
}

interface PipelineStepHandler {
  (state?: PipelineState, params?: RouteParams): Component;
}

type PipelineState = Record<string, any>;

export const loadWith = (el: Element): PipelineStep => ({
  async getState(): Promise<void> {
    m.render(el, m(Loading));
  }
});

export const ifLoggedInRedirectTo = (url: string): PipelineStep => ({
  async getState(): Promise<void> {
    await initialUserAuth;
    const { currentUser } = store.getState();
    if (isLoggedIn(currentUser)) m.route.set(url);
  }
});

export const authorize: PipelineStep = {
  async getState(): Promise<{ userId: string }> {
    await initialUserAuth;
    const { currentUser } = store.getState();
    if (!isLoggedIn(currentUser)) throw new Error('Unauthorized');
    return { userId: currentUser.auth.uid };
  },
  onError: () => Unauthorized
};

export const queryLogs: PipelineStep = {
  async getState({ userId }): Promise<{ logs: Log[] }> {
    const logs = await LogServices.query(userId);
    return { logs };
  },
  onError: () => NotFound // TODO: Handle other errors
};

export const queryReports: PipelineStep = {
  async getState({ userId }): Promise<{ reports: Report[] }> {
    const reports = await ReportServices.query(userId);
    return { reports };
  },
  onError: () => NotFound // TODO: Handle other errors
};

export const getReport: PipelineStep = {
  async getState({ userId }, { reportId }): Promise<{ report: Report }> {
    const report = await ReportServices.get(userId, reportId);
    return { report };
  },
  onError: () => NotFound // TODO: Handle other errors
};

export const pipeline = (steps: PipelineStep[], componentFn: PipelineStepHandler) => {
  if (steps.length === 0) throw new Error(`Pipeline must contain at least 1 element! ${JSON.stringify(steps, null, 2)}`);

  return async (params: RouteParams): Promise<Component> => {
    let state: PipelineState = {};
    for (const step of steps) {
      try {
        const newState = await step.getState(state, params);
        if (newState) {
          state = { ...state, ...newState };
        }
      }
      catch (error) {
        return step.onError(state, params);
      }
    }

    return componentFn(state, params);
  };
};
