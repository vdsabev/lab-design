import * as firebase from 'firebase/app';
import 'firebase/auth';

import { notify } from './alert';
import { CurrentUserActions } from './current-user';
import { store } from './store';
import { ProfileServices } from './profile';

// Auth
let initialUserAuthResolver: { resolve: Function, done?: boolean };
export const initialUserAuth = new Promise<firebase.User>((resolve) => initialUserAuthResolver = { resolve });

export function initializeAuth() {
  firebase.auth().onAuthStateChanged(async (auth: firebase.User) => {
    const action = auth ? CurrentUserActions.USER_LOGGED_IN : CurrentUserActions.USER_LOGGED_OUT;
    store.dispatch({ type: action, auth });

    if (!initialUserAuthResolver.done) {
      initialUserAuthResolver.resolve(auth);
      initialUserAuthResolver.done = true;
    }

    if (!auth) return;

    loadProfile(auth.uid);
  });
}

const loadProfile = async (userId: string) => {
  try {
    const profile = await ProfileServices.getProfile({ userId });
    store.dispatch({ type: CurrentUserActions.USER_PROFILE_LOADED, profile });
  }
  catch (error) {
    notify.error(error);
  }
};

// Services
export const AuthServices = {
  login: (email: string, password: string) => firebase.auth().signInWithEmailAndPassword(email, password).catch(notify.error),
  logout: () => firebase.auth().signOut().catch(notify.error)
};
