/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'core-js-pure/features/set' {
  interface Set<T> {
      add(value: T): this;
      clear(): void;
      delete(value: T): boolean;
      forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
      has(value: T): boolean;
      difference(other: Set<T>): Set<T>;
      isSupersetOf(other: Set<T>): boolean;
      readonly size: number;
  }
  interface SetConstructor {
      new <T = any>(values?: readonly T[] | null): Set<T>;
      readonly prototype: Set<any>;
  }
  const Set: SetConstructor;
  export default Set;
}
