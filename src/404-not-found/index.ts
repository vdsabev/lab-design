import { div, h2 } from 'compote/html';
import { Component } from 'mithril';

export const NotFound: Component<HTMLDivElement, null> = {
  view: () => (
    div({ class: 'container fade-in-animation' }, [
      h2('Error 404 - page not found')
    ])
  )
};
