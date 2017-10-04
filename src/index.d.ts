import { Hyperscript, Vnode, Component, Children, Lifecycle } from 'mithril';

declare global {
  const process: {
    env: Record<string, any>;
  };

  interface Action<ActionType> {
    type?: ActionType;
  }

  const m: Hyperscript;

  interface FnComponent<ElementAttrs, ComponentAttrs = {}> {
    (vnode: Vnode<Partial<ElementAttrs> & ComponentAttrs, {}>): Component<Partial<ElementAttrs> & ComponentAttrs, {}>;
  }

  namespace JSX {
    export type Element = Children | null | void;

    export type IntrinsicElements<TagName extends keyof ElementTagNameMap> = {
      [T in TagName]: RecursivePartial<ElementTagNameMap[T]> & Attributes<ElementTagNameMap[T], any>
    };

    type RecursivePartial<T> = {
      [P in keyof T]?: RecursivePartial<T[P]>
    };

    interface Attributes<Attrs, State> extends Lifecycle<Attrs, State> {
      className?: string;
      class?: string;
      key?: string | number;
    }
  }
}
