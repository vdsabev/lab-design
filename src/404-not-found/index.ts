import { div, h2 } from 'compote/html';

export const NotFound = {
  view: () => (
    div({ class: 'container fade-in-animation' }, [
      h2('Error 404 - page not found')
    ])
  )
};
