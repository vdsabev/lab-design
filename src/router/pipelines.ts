import { route } from 'mithril';

import { Unauthorized } from '../401-unauthorized';
import { NotFound } from '../404-not-found';
import { Loading } from '../loading';

import { initialUserAuth } from '../auth';
import { LogServices } from '../log';
import { ReportServices } from '../report';
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

export const ifLoggedInRedirectTo = (url: string): PipelineStep => ({
  getState: async () => {
    await initialUserAuth;
    const { currentUser } = store.getState();
    if (isLoggedIn(currentUser)) route.set(url);
  }
});

export const authorize: PipelineStep = {
  getState: async () => {
    await initialUserAuth;
    const { currentUser } = store.getState();
    if (!isLoggedIn(currentUser)) throw new Error('Unauthorized');
    return { userId: currentUser.auth.uid };
  },
  onError: () => Unauthorized
};

export const queryLogs: PipelineStep = {
  getState: ({ userId }: PipelineState) => LogServices.query(userId).then((logs) => ({ logs })),
  onError: () => NotFound // TODO: Handle other errors
};

export const queryReports: PipelineStep = {
  getState: ({ userId }: PipelineState) => ReportServices.query(userId).then((reports) => ({ reports })),
  onError: () => NotFound // TODO: Handle other errors
};

export const getReport: PipelineStep = {
  getState: ({ userId }: PipelineState, { reportId }: RouteParams) => ReportServices.get(userId, reportId).then((report) => ({ report })),
  onError: () => NotFound // TODO: Handle other errors
};

export const pipeline = (steps: PipelineStep[], componentFn: PipelineStepHandler) => {
  if (steps.length === 0) throw new Error(`Pipeline must contain at least 1 element! ${JSON.stringify(steps, null, 2)}`);

  let loading = false;
  return (params: RouteParams) => new Promise<Component>((resolve) => {
    if (!loading) {
      loading = true;
      resolve(Loading);
      reloadRoute();
      return;
    }

    let state: PipelineState = {};

    const setState = (newState: PipelineState | void) => {
      if (newState) {
        state = { ...state, ...newState };
      }
    };

    steps.reduce((promise, step) => {
      if (!promise) return step.getState(state, params);

      return promise.catch(() => {
        loading = false;
        resolve(step.onError(state, params));
      }).then((newState) => {
        setState(newState);
        return step.getState(state, params);
      });
    }, <Promise<PipelineState | void>>null).then((newState) => {
      setState(newState);
      loading = false;
      resolve(componentFn(state, params));
    });
  });
};

export const reloadRoute = () => {
  route.set(window.location.href, undefined, { replace: true });
};
