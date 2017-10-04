import * as m from 'mithril';

import { Loading } from '../loading';
import { route } from './index';

export const reloadRoute = () => {
  route.set(window.location.href, undefined, { replace: true });
};

export const redirectTo = (url: string) => () => {
  route.set(url);
  return { view: render(Loading) };
};

export const load = <T>(component: FnComponent<any, any>, key?: keyof T) => (result?: T) => ({
  view: render(component, key != null && result != null ? { [key]: result[key] } : null)
});

const render = (component: FnComponent<any, any>, ...args: any[]) => () => m(component, ...args);
