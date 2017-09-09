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
  getState: (state?: Record<string, any>, params?: RouteParams) => Promise<any>;
  onError?: PipelineStepHandler;
}

interface PipelineStepHandler {
  (state?: Record<string, any>, params?: RouteParams): Component;
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

  let stepIndex: number;
  let state: Record<string, any>;
  let failed: boolean;
  let succeeded: boolean;

  const reset = () => {
    stepIndex = 0;
    state = {};
    failed = null;
    succeeded = null;
  };

  reset();

  return (params: RouteParams) => new Promise((resolve) => {
    if (failed) {
      const onError = steps[stepIndex].onError;
      resolve(onError(state, params));
      reset();
      return;
    }

    if (succeeded) {
      if (stepIndex === steps.length - 1) {
        resolve(componentFn(state, params));
        reset();
        return;
      }

      succeeded = null;
      stepIndex++;
    }

    resolve(Loading);
    const stateFn = steps[stepIndex].getState;
    stateFn(state, params)
      .catch(() => {
        failed = true;
        reloadRoute();
      })
      .then((newState) => {
        succeeded = true;
        state = { ...<any>state, ...<any>newState };
        reloadRoute();
      });
  });
};

export const reloadRoute = () => {
  route.set(window.location.href, undefined, { replace: true });
};
