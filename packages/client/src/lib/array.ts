import get from "lodash/get";

export { deepFreeze, indexArrayBy, sortBy, sumReducer, toArray };

type OnlyNumberKeys<T> = keyof {
  [K in keyof T as T[K] extends number ? K : never]: T[K];
};

function sortBy<T>(key: OnlyNumberKeys<T>, order: "asc" | "desc" = "asc") {
  const orderFactor = order === "desc" ? -1 : 1;
  return (a: T, b: T) =>
    orderFactor *
    ((a[key] as unknown as number) - (b[key] as unknown as number));
}

function deepFreeze<T>(arr: T[]): readonly T[] {
  const propNames = Object.getOwnPropertyNames(arr);

  for (const name of propNames) {
    const value = (arr as any)[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(arr);
}

const sumReducer = (sum: number, nb: number): number => sum + nb;

const toArray = <T>(val: T | T[]): T[] => {
  return isArraySafe(val) ? val : [val];
};

const isArraySafe = <T>(val: T | T[]): val is T[] => {
  return val && Array.isArray(val);
};

/**
 * Create an object from an array where items are indexed by the specified key.
 * @example
 * const arr = [{ id: 1, name: "John"}, { id: 2, name: "Doe"}];
 * indexArrayBy(arr, "name");
 * // => { "John": { id: 1, name: "John"}, "Doe": { id: 2, name: "Doe"} }
 */
const indexArrayBy = <
  T extends Record<string | number | symbol, any>,
  U extends DeepPath<T>
>(
  arr: T[],
  key: U
): Record<KeyUnknownGuard<T[U]>, T> => {
  return Object.fromEntries(arr.map((item) => [get(item, key), item]));
};

type DeepPath<T extends Record<string | number, any>> = DeepPathRecursive<
  T,
  keyof T,
  "",
  [1, 2, 3]
>;

type DeepPathRecursive<
  T extends Record<string | number, any>,
  TKey extends keyof T,
  TPrefix extends string,
  TRecursion extends any[]
> = TKey extends TemplatableTypes
  ? Head<TRecursion> extends never
    ? `${TPrefix}${TKey}`
    : T[TKey] extends number | string
    ? `${TPrefix}${TKey}`
    : T[TKey] extends Record<string | number, any>
    ? DeepPathRecursive<
        T[TKey],
        keyof T[TKey],
        `${TPrefix}${TKey}.`,
        Tail<TRecursion>
      >
    : ""
  : "";

type TemplatableTypes = string | number | bigint | boolean | null | undefined;

type Head<T extends unknown[]> = T extends [infer THead, ...infer _]
  ? THead
  : never;

type Tail<T extends unknown[]> = T extends [infer _, ...infer TTail]
  ? TTail
  : never;

type KeyUnknownGuard<T> = T extends string | number | symbol ? T : any;
