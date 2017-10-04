import { Hyperscript, Vnode, Component, Children, Lifecycle } from 'mithril';

// TODO: Allow using stateless components with JSX
// TODO: Validate component property types
// TODO: Fix SVG elements types
declare global {
  const process: {
    env: Record<string, any>;
  };

  interface Action<ActionType> {
    type?: ActionType;
  }

  const m: Hyperscript;

  interface FnComponent<ComponentAttrs = {}, ElementAttrs = HTMLDivElement> {
    (vnode: Vnode<ComponentAttrs & Partial<ElementAttrs>, null>): Component<ComponentAttrs & Partial<ElementAttrs>, null>;
  }

  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
  namespace JSX {
    type Element = Children | null | void;

    type IntrinsicElements<TagName extends keyof ElementTagNameMap> = {
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
