/// <reference types="mithril" />

declare const process: Process;

interface Process {
  env: Record<string, any>;
}

interface Action<ActionType> {
  type?: ActionType;
}

declare const m: Mithril.Hyperscript;

interface FnComponent<ElementAttrs, ComponentAttrs = {}> {
	(vnode: Mithril.Vnode<Partial<ElementAttrs> & ComponentAttrs, {}>): Mithril.Component<Partial<ElementAttrs> & ComponentAttrs, {}>;
}

declare namespace JSX {
  export type Element = Mithril.Children | null | void;

  export type IntrinsicElements<TagName extends keyof ElementTagNameMap> = {
    [T in TagName]: RecursivePartial<ElementTagNameMap[T]> & Partial<Mithril.Lifecycle<any, any>>;
  }

  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  }
}
