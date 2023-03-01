export { deepFreeze, sortBy, sumReducer };

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
