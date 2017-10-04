import * as m from 'mithril';
import { Loading } from '../loading';

export const reloadRoute = () => {
  m.route.set(window.location.href, undefined, { replace: true });
};

export const redirectTo = (url: string) => () => {
  m.route.set(url);
  return { view: render(Loading) };
};

export const load = <T>(component: FnComponent<any, any>, key?: keyof T) => (result?: T) => ({
  view: render(component, key != null && result != null ? { [key]: result[key] } : null)
});

const render = (component: FnComponent<any, any>, ...args: any[]) => () => m(component, ...args);
