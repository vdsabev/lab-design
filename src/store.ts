import { logger } from 'compote/components/logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { CurrentUser } from './user';

interface State {
  currentUser: CurrentUser;
}

export enum Actions {
  USER_PROFILE_LOADED = 'USER_PROFILE_LOADED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT'
}

export const store = createStore(
  combineReducers<State>({ currentUser }),
  process.env.NODE_ENV === 'production' ? undefined : applyMiddleware(logger)
);

// Current User
type CurrentUserAction = Action<Actions> & Partial<CurrentUser>;

export function currentUser(state: Partial<CurrentUser> = null, action: CurrentUserAction = {}): Partial<CurrentUser> {
  switch (action.type) {
  case Actions.USER_PROFILE_LOADED:
    return { ...state, profile: action.profile };
  case Actions.USER_LOGGED_IN:
    return { auth: action.auth };
  case Actions.USER_LOGGED_OUT:
    return {};
  default:
    return state;
  }
}
