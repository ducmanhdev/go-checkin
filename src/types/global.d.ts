export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };
  declare type Nullable<T> = T | null;
  declare type Resolve = typeof ReturnType<Promise.resolve>;
  declare type Reject = typeof ReturnType<Promise.reject>;
  declare interface InputEvent extends Event {
    target: HTMLInputElement;
  }
}
