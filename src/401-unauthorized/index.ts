import { div, h2 } from 'compote/html';

export const Unauthorized = {
  view: () => (
    div({ class: 'container fade-in-animation' }, [
      h2('Error 401 - you have to login with your account to access this page')
    ])
  )
};
