import './style.scss';

import { div, img, a } from 'compote/html';
import { flex } from 'compote/components/flex';
import { Component, route } from 'mithril';

import { logout } from '../logout';
import { store } from '../store';
import { isLoggedIn } from '../user';

export const Header: Component<Partial<HTMLDivElement>, null> = {
  view() {
    const { currentUser } = store.getState();
    return (
      div({ class: 'container flex-row align-items-center' }, [
        img({ class: 'width-xs mr-md', src: 'icon.png' }),
        a({ class: 'menu-link pa-md', oncreate: route.link, href: '/reports' }, 'Reports'),
        a({ class: 'menu-link pa-md', oncreate: route.link, href: '/logs' }, 'Logs'),
        div({ style: flex(1) }),
        currentUser != null ?
          isLoggedIn(currentUser) ? LogoutLink() : LoginLink()
          :
          null
      ])
    );
  }
};

const LoginLink = () => a({ class: 'color-neutral-lighter', oncreate: route.link, href: '/login' }, 'Login');

const LogoutLink = () => a({ class: 'color-neutral-lighter', onclick: logout }, 'Logout');
