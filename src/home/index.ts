import { div, h1 } from 'compote/html';

export const Home = {
  view: () => (
    div({ class: 'container fade-in-animation' }, [
      h1('Lab Design')
    ])
  )
};
