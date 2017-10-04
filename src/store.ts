import { logger } from 'compote/components/logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Alert, alerts } from './alert';
import { CurrentUser, currentUser } from './current-user';

interface State {
  currentUser: CurrentUser;
  alerts: Alert[];
}

export const store = createStore(
  combineReducers<State>({ currentUser, alerts }),
  process.env.NODE_ENV === 'production' ? undefined : applyMiddleware(logger)
);
