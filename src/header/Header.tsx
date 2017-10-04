import './Header.scss';

import { flex } from 'compote/components/flex';

import { AuthServices } from '../auth';
import { isLoggedIn } from '../current-user';
import { route, Routes } from '../router';
import { store } from '../store';

export const Header: FnComponent = () => ({
  view() {
    const { currentUser } = store.getState();
    return (
      <div class="container flex-row align-items-center">
        <img class="width-xs mr-md" src="icon.png" />
        <a class="menu-link pa-md" oncreate={route.link} href={Routes.PROFILE}>Profile</a>
        <a class="menu-link pa-md" oncreate={route.link} href={Routes.LOG_LIST}>Logs</a>
        <a class="menu-link pa-md" oncreate={route.link} href={Routes.REPORT_LIST}>Reports</a>
        <a class="menu-link pa-md" oncreate={route.link} href={Routes.TIMELINE}>Timeline</a>
        <div style={flex(1)}></div>
        {currentUser != null ?
          isLoggedIn(currentUser) ? LogoutLink() : LoginLinks()
          :
          null}
      </div>
    );
  }
});

const LoginLinks = () => [
  <a class="color-neutral-lighter mr-md" oncreate={route.link} href={Routes.REGISTER}>Register</a>,
  <a class="color-neutral-lighter" oncreate={route.link} href={Routes.LOGIN}>Login</a>
];

const LogoutLink = () => <a class="color-neutral-lighter" onclick={logout}>Logout</a>;

const logout = () => AuthServices.logout().then(() => route.set(Routes.LOGIN));
