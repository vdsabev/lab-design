import * as firebase from 'firebase/app';

import { Profile } from './profile';
import { route, reloadRoute } from './router';

// Entity
export interface CurrentUser {
  auth: firebase.User;
  profile: Profile;
}

export const isLoggedIn = (currentUser: CurrentUser) => currentUser != null && currentUser.auth != null && currentUser.auth.uid != null;

// Store
export enum CurrentUserActions {
  USER_PROFILE_LOADED = 'USER_PROFILE_LOADED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT'
}

type CurrentUserAction = Action<CurrentUserActions> & Partial<CurrentUser>;

export function currentUser(state: Partial<CurrentUser> = null, action: CurrentUserAction = {}): Partial<CurrentUser> {
  switch (action.type) {
  case CurrentUserActions.USER_PROFILE_LOADED:
    return { ...state, profile: action.profile };
  case CurrentUserActions.USER_LOGGED_IN:
    reloadRoute();
    return { auth: action.auth };
  case CurrentUserActions.USER_LOGGED_OUT:
    if (state != null) {
      route.set('/');
    }
    return {};
  }
  return state;
}
