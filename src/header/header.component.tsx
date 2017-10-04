import './header.style.scss';

import { flex } from 'compote/components/flex';
import { route } from 'mithril';

import { isLoggedIn } from '../auth';
import { logout } from '../logout';
import { store } from '../store';

export const Header: FnComponent<HTMLDivElement> = () => ({
  view() {
    const { currentUser } = store.getState();
    return (
      <div class="container flex-row align-items-center">
        <img class="width-xs mr-md" src="icon.png" />
        <a class="menu-link pa-md" oncreate={route.link} href="/profile">Profile</a>
        <a class="menu-link pa-md" oncreate={route.link} href="/logs">Logs</a>
        <a class="menu-link pa-md" oncreate={route.link} href="/reports">Reports</a>
        <a class="menu-link pa-md" oncreate={route.link} href="/timeline">Timeline</a>
        <div style={flex(1)}></div>
        {currentUser != null ?
          isLoggedIn(currentUser) ? <LogoutLink /> : <LoginLink />
          :
          null}
      </div>
    );
  }
});

const LoginLink: FnComponent<HTMLAnchorElement, { a: number }> = () => ({
  view: () => <a class="color-neutral-lighter" oncreate={route.link} href="/login">Login</a>
});

const LogoutLink: FnComponent<HTMLAnchorElement> = () => ({
  view: () => <a class="color-neutral-lighter" onclick={logout}>Logout</a>
});
