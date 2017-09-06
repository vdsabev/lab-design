import './style.scss';

import { div, img, a } from 'compote/html';
import { Component, route } from 'mithril';

export const Header: Component<HTMLDivElement, null> = {
  view: () => (
    div({ class: 'container flex-row align-items-center' }, [
      img({ class: 'width-xs mr-md', src: 'icon.png' }),
      a({ class: 'menu-link pa-md', oncreate: route.link, href: '/reports' }, 'Reports')
    ])
  )
};
